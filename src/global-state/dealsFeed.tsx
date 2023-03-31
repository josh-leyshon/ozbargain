import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { getOzbargainFeedFromUrl } from '../feed-parser/parser';
import type { OzbargainFeed } from '../feed-parser/parser';
import { UnreachableError } from '../base/unreachableError';

type Deal = OzbargainFeed['deals'][number];

const FEED_URL_NEW_DEALS = 'https://www.ozbargain.com.au/deals/feed';

export class DealsFeed {
  /**
   * Public for accessing within utility functions.
   * Should not be used directly by consumers. Prefer methods on this class instead.
   */
  readonly feed: OzbargainFeed;

  /** The last-fetched page number of the feed. */
  readonly lastFetchedPage: number;

  constructor(
    feed: OzbargainFeed,
    /** Will merge new feed with previous feed. Deals will not be duplicated. */
    previousFeed?: OzbargainFeed,
    /** Defaults to 0 if unset. */
    lastFetchedPage?: number,
  ) {
    if (previousFeed) {
      this.feed = DealsFeed.mergeFeeds(previousFeed, feed);
    } else {
      this.feed = feed;
    }
    this.lastFetchedPage = lastFetchedPage ?? 0;
  }

  getDeals(): Deal[] {
    return this.feed.deals;
  }

  getDealById(id: Deal['id']): Deal {
    const foundDeal = this.feed.deals.find(deal => deal.id === id);
    if (!foundDeal) {
      throw new Error(`Unable to find deal with ID ${id}`);
    }
    return foundDeal;
  }

  /** If duplicate deals exist, keeps those in feed2. */
  private static mergeFeeds(
    feed1: OzbargainFeed,
    feed2: OzbargainFeed,
  ): OzbargainFeed {
    return {
      // Assumes both feeds are from the same source
      meta: feed1.meta,
      deals: feed1.deals
        .filter(d1 => feed2.deals.every(d2 => d1.id !== d2.id))
        .concat(feed2.deals),
    };
  }
}

/**
 * @param page The feed page to fetch. Default: 0
 */
type FeedFetcher = (page?: number) => Promise<OzbargainFeed>;

export const localFetchFeed: FeedFetcher = async () => {
  // Fails to find file if string is extracted to a variable, for some reason.
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-unsafe-assignment
  const feed: OzbargainFeed = require('../feed-parser/tests/fixtures/parsed-ozbargain-rss');

  // Turn date strings back into dates.
  feed.deals = feed.deals.map(deal => ({
    ...deal,
    postedAt: new Date(deal.postedAt),
    expiresAt: deal.expiresAt != null ? new Date(deal.expiresAt) : undefined,
  }));

  // Simulate loading time over the network.
  const sleep = (millis: number) =>
    new Promise(res => {
      setTimeout(() => res(null), millis);
    });
  await sleep(1500);

  return feed;
};

export const onlineFetchFeed: FeedFetcher = (page = 0) => {
  return getOzbargainFeedFromUrl(`${FEED_URL_NEW_DEALS}?page=${page}`);
};

type State =
  | {
      state: 'refreshing';
      dealsFeed?: DealsFeed;
    }
  | {
      state: 'ready';
      dealsFeed: DealsFeed;
    };
type MaybeUninitializedState =
  | State
  | {
      state: 'uninitialised';
      dealsFeed?: DealsFeed;
    };
type Action =
  | {
      type: 'refresh';
    }
  | {
      type: 'set';
      dealsFeed: DealsFeed;
    };
type Dispatch = (action: Action) => void;

function dealsFeedReducer(
  state: MaybeUninitializedState,
  action: Action,
): MaybeUninitializedState {
  switch (action.type) {
    case 'refresh':
      return { ...state, state: 'refreshing' };
    case 'set':
      return { dealsFeed: action.dealsFeed, state: 'ready' };
    default:
      throw new UnreachableError(action);
  }
}

async function refreshNewFeed(
  fetchFeed: FeedFetcher,
  dispatch: Dispatch,
): Promise<void> {
  dispatch({ type: 'refresh' });

  const newFeed = await fetchFeed();

  dispatch({
    type: 'set',
    dealsFeed: new DealsFeed(newFeed),
  });
}

async function loadFeedNextPage(
  fetchFeed: FeedFetcher,
  dispatch: Dispatch,
  dealsFeed: DealsFeed,
): Promise<void> {
  dispatch({ type: 'refresh' });

  const { lastFetchedPage } = dealsFeed;
  const newFeed = await fetchFeed(lastFetchedPage + 1);

  dispatch({
    type: 'set',
    dealsFeed: new DealsFeed(dealsFeed.feed, newFeed, lastFetchedPage),
  });
}

type DealsFeedContextProps = MaybeUninitializedState & {
  /** Refresh entire feed. */
  refresh: () => void;
  /** Load the next page in the feed. */
  loadNextPage: (dealsFeed: DealsFeed) => void;
};
const DealsFeedContext = createContext<DealsFeedContextProps | undefined>(
  undefined,
);

export function DealsFeedProvider({
  children,
  fetchFeed,
}: React.PropsWithChildren<{
  fetchFeed: FeedFetcher;
}>): JSX.Element {
  const [state, dispatch] = useReducer(dealsFeedReducer, {
    state: 'uninitialised',
  });

  const value: DealsFeedContextProps = useMemo(() => {
    return {
      ...state,
      refresh: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        refreshNewFeed(fetchFeed, dispatch);
      },
      // Need to take dealsFeed as param instead of using state.dealsFeed from this function's closure,
      // because at this point state.dealsFeed may be undefined.
      loadNextPage: (dealsFeed: DealsFeed) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loadFeedNextPage(fetchFeed, dispatch, dealsFeed);
      },
    };
  }, [state, dispatch, fetchFeed]);

  return (
    <DealsFeedContext.Provider value={value}>
      {children}
    </DealsFeedContext.Provider>
  );
}

export function useDealsFeed(): Omit<
  DealsFeedContextProps,
  keyof MaybeUninitializedState
> &
  State {
  const context = useContext(DealsFeedContext);
  if (context == null) {
    throw new Error('Could not find DealsFeed Provider');
  }

  // Assuming the app runs single-threaded, this should only occur once.
  useEffect(() => {
    if (context.state === 'uninitialised') {
      context.refresh();
    }
  }, [context]);

  // Had type errors with assigning `state` when trying to make this smaller using `...context`.
  return context.state === 'uninitialised' || context.state === 'refreshing'
    ? {
        state: 'refreshing',
        dealsFeed: context.dealsFeed,
        refresh: context.refresh,
        loadNextPage: context.loadNextPage,
      }
    : {
        state: 'ready',
        dealsFeed: context.dealsFeed,
        refresh: context.refresh,
        loadNextPage: context.loadNextPage,
      };
}
