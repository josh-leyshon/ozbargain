import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { UnreachableError } from '../base/unreachableError';
import { getOzbargainFeedFromUrl } from '../feed-parser/parser';
import type { Deal, OzbargainFeed } from '../feed-parser/parser';

/**
 * @param page The feed page to fetch. Default: 0
 */
type FeedFetcher = (page?: number) => Promise<OzbargainFeed>;
/**
 * Same behaviour as the default array .sort() method (copy/pasted below).
 *
 * It is expected to return a negative value if the first argument is less than the second argument,
 * zero if they're equal, and a positive value otherwise.
 */
type DealsSorter = (deal1: Deal, deal2: Deal) => number;

const TOP_DEALS_FEED_URL = 'https://www.ozbargain.com.au/feed';
const NEW_DEALS_FEED_URL = 'https://www.ozbargain.com.au/deals/feed';

type DealsFeed2ConstructorArgs = {
  topDeals: {
    feed: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage?: number;
  };
  newDeals: {
    feed: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage?: number;
  };
};

export class DealsFeed2 {
  readonly topDeals: {
    feed: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage: number;
  };

  readonly newDeals: {
    feed: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage: number;
  };

  constructor({ topDeals, newDeals }: DealsFeed2ConstructorArgs) {
    this.topDeals = { ...topDeals, lastFetchedPage: topDeals.lastFetchedPage ?? -1 };
    this.newDeals = { ...newDeals, lastFetchedPage: newDeals.lastFetchedPage ?? -1 };
  }

  getTopDeals(): Deal[] {
    return this.topDeals.feed.deals;
  }

  getNewDeals(): Deal[] {
    return this.newDeals.feed.deals;
  }

  getDealById(id: Deal['id']): Deal {
    const allDeals = [...this.topDeals.feed.deals, ...this.newDeals.feed.deals];
    const deal = allDeals.find(deal => deal.id === id);
    if (!deal) {
      throw new Error(`Unable to find deal with ID ${id}`);
    }
    return deal;
  }

  /** Returns a new DealsFeed with an updated internal state. */
  async loadTopDealsFeedNextPage(): Promise<DealsFeed2> {
    const nextPageNumber = this.topDeals.lastFetchedPage + 1;
    const nextPageFeed = await this.topDeals.fetcher(nextPageNumber);

    return new DealsFeed2({
      newDeals: {
        ...this.newDeals,
      },
      topDeals: {
        ...this.topDeals,
        feed: DealsFeed2.mergeFeeds(this.topDeals.feed, nextPageFeed, DealsFeed2.topDealsSorter),
        lastFetchedPage: nextPageNumber,
      },
    });
  }

  /** Returns a new DealsFeed with an updated internal state. */
  async loadNewDealsFeedNextPage(): Promise<DealsFeed2> {
    const nextPageNumber = this.newDeals.lastFetchedPage + 1;
    const nextPageFeed = await this.newDeals.fetcher(nextPageNumber);

    return new DealsFeed2({
      newDeals: {
        ...this.newDeals,
        feed: DealsFeed2.mergeFeeds(this.newDeals.feed, nextPageFeed, DealsFeed2.newDealsSorter),
        lastFetchedPage: nextPageNumber,
      },
      topDeals: {
        ...this.topDeals,
      },
    });
  }

  /** If duplicate deals exist, keeps those in feed2. */
  private static mergeFeeds(
    feed1: OzbargainFeed,
    feed2: OzbargainFeed,
    sorter: DealsSorter,
  ): OzbargainFeed {
    return {
      // Assumes both feeds are from the same source
      meta: feed1.meta,
      deals: feed1.deals
        .filter(d1 => feed2.deals.every(d2 => d1.id !== d2.id))
        .concat(feed2.deals)
        .sort(sorter),
    };
  }

  // TODO: How are top deals sorted?
  private static topDealsSorter: DealsSorter = (deal1, deal2) => 0;
  private static newDealsSorter: DealsSorter = (deal1, deal2) => deal1.postedAt.getTime() - deal2.postedAt.getTime();
}

export class DealsFeed {
  /**
   * Public for accessing within utility functions.
   * Should not be used directly by consumers. Prefer methods on this class instead.
   */
  readonly feed: OzbargainFeed;

  /**
   * The FeedFetcher used to initially create this DealsFeed.
   * More pages will be fetched using this same fetcher.
   */
  readonly fetchFeed: FeedFetcher;

  /** The last-fetched page number of the feed. */
  private readonly lastFetchedPage: number;

  constructor({
    feed,
    lastFetchedPage,
    ...rest
  }:
    & { feed: OzbargainFeed; lastFetchedPage?: number }
    & (
      | { fetchFeed: FeedFetcher }
      | { previousDealsFeed: DealsFeed }
    ))
  {
    if ('previousDealsFeed' in rest) {
      this.feed = DealsFeed.mergeFeeds(rest.previousDealsFeed.feed, feed);
      this.fetchFeed = rest.previousDealsFeed.fetchFeed;
    } else {
      this.feed = feed;
      this.fetchFeed = rest.fetchFeed;
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

  /** Returns a new DealsFeed with an updated internal feed. */
  async loadFeedNextPage(): Promise<DealsFeed> {
    const newFeed = await this.fetchFeed(this.lastFetchedPage + 1);

    return new DealsFeed({
      feed: newFeed,
      previousDealsFeed: this,
      lastFetchedPage: this.lastFetchedPage + 1,
    });
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
        .concat(feed2.deals)
        // Keep deals sorted in highest -> lowest order (newest -> oldest deals)
        .sort(({ postedAt: postedAtA }, { postedAt: postedAtB }) => postedAtB.getTime() - postedAtA.getTime()),
    };
  }
}

export const localFetchFeed: FeedFetcher = async () => {
  // Fails to find file if string is extracted to a variable, for some reason.
  // Also fails to load this file if it is within a `__tests__` directory.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const feed: OzbargainFeed = require('./localAssets/ozbargain-rss.parsed.json');

  // Turn date strings back into dates.
  feed.deals = feed.deals.map(deal => ({
    ...deal,
    postedAt: new Date(deal.postedAt),
    expiresAt: deal.expiresAt != null ? new Date(deal.expiresAt) : undefined,
  }));

  // Simulate loading time over the network.
  const sleep = (millis: number) =>
    new Promise(resolve => {
      setTimeout(() => resolve(null), millis);
    });
  await sleep(1500);

  return feed;
};

// Ozbargain feeds seem to have a 20 page limit (0 - 19) before 404ing.
export const onlineTopDealsFetchFeed: FeedFetcher = (page = 0) => {
  return getOzbargainFeedFromUrl(`${TOP_DEALS_FEED_URL}?page=${page}`);
};
// Ozbargain feeds seem to have a 20 page limit (0 - 19) before 404ing.
export const onlineNewDealsFetchFeed: FeedFetcher = (page = 0) => {
  return getOzbargainFeedFromUrl(`${NEW_DEALS_FEED_URL}?page=${page}`);
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
  dispatch: Dispatch,
  fetchFeed: FeedFetcher,
): Promise<void> {
  dispatch({ type: 'refresh' });

  const newFeed = await fetchFeed();

  dispatch({
    type: 'set',
    dealsFeed: new DealsFeed({ feed: newFeed, fetchFeed }),
  });
}

async function loadFeedNextPage(
  dispatch: Dispatch,
  dealsFeed: DealsFeed,
): Promise<void> {
  dispatch({ type: 'refresh' });

  const newDealsFeed = await dealsFeed.loadFeedNextPage();

  dispatch({
    type: 'set',
    dealsFeed: newDealsFeed,
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
}>): React.JSX.Element {
  const [state, dispatch] = useReducer(dealsFeedReducer, {
    state: 'uninitialised',
  });

  const value: DealsFeedContextProps = useMemo(() => {
    return {
      ...state,
      refresh: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        refreshNewFeed(dispatch, fetchFeed);
      },
      // Need to take dealsFeed as param instead of using state.dealsFeed from this function's closure,
      // because at this point state.dealsFeed may be undefined.
      loadNextPage: (dealsFeed: DealsFeed) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loadFeedNextPage(dispatch, dealsFeed);
      },
    };
  }, [state, dispatch, fetchFeed]);

  return (
    <DealsFeedContext.Provider value={value}>
      {children}
    </DealsFeedContext.Provider>
  );
}

export function useDealsFeed():
  & Omit<
    DealsFeedContextProps,
    keyof MaybeUninitializedState
  >
  & State
{
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
