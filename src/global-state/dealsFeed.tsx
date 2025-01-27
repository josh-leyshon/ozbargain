import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { OZBARGAIN_BASE_URL } from '../base/constants/urls';
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

const TOP_DEALS_FEED_URL = `${OZBARGAIN_BASE_URL}/feed`;
const NEW_DEALS_FEED_URL = `${OZBARGAIN_BASE_URL}/deals/feed`;

type DealsFeedConstructorArgs = {
  topDeals: {
    feed?: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage?: number;
  };
  newDeals: {
    feed?: OzbargainFeed;
    fetcher: FeedFetcher;
    lastFetchedPage?: number;
  };
};

export class DealsFeed {
  // Ozbargain feeds seem to have a 20 page limit (pages 0 - 19 are valid) before 404ing.
  private static feedMaxPages = 20;

  readonly topDeals: DealsFeedConstructorArgs['topDeals'];
  readonly newDeals: DealsFeedConstructorArgs['newDeals'];

  constructor({ topDeals, newDeals }: DealsFeedConstructorArgs) {
    this.topDeals = topDeals;
    this.newDeals = newDeals;
  }

  getTopDeals(): Deal[] {
    const deals = this.topDeals.feed?.deals;
    if (!deals) {
      throw new Error('No top deals feed exists.');
    }
    return deals;
  }

  getNewDeals(): Deal[] {
    const deals = this.newDeals.feed?.deals;
    if (!deals) {
      throw new Error('No new deals feed exists.');
    }
    return deals;
  }

  getDealById(id: Deal['id']): Deal {
    const allDeals = [...this.topDeals.feed?.deals ?? [], ...this.newDeals.feed?.deals ?? []];
    const deal = allDeals.find(deal => deal.id === id);
    if (!deal) {
      throw new Error(`Unable to find deal with ID ${id}`);
    }
    return deal;
  }

  /** Returns a new DealsFeed with an updated internal state. */
  async loadTopDealsFeedNextPage(): Promise<DealsFeed> {
    const nextPageNumber = (this.topDeals.lastFetchedPage ?? -1) + 1;
    if (nextPageNumber >= DealsFeed.feedMaxPages) {
      console.log('Reached the end of the Top deals feed (page 20).');
      return this;
    }

    const nextPageFeed = await this.topDeals.fetcher(nextPageNumber);

    return new DealsFeed({
      newDeals: {
        ...this.newDeals,
      },
      topDeals: {
        ...this.topDeals,
        feed: this.topDeals.feed
          ? DealsFeed.mergeFeeds(this.topDeals.feed, nextPageFeed, DealsFeed.topDealsSorter)
          : nextPageFeed,
        lastFetchedPage: nextPageNumber,
      },
    });
  }

  /** Returns a new DealsFeed with an updated internal state. */
  async loadNewDealsFeedNextPage(): Promise<DealsFeed> {
    const nextPageNumber = (this.newDeals.lastFetchedPage ?? -1) + 1;
    if (nextPageNumber >= DealsFeed.feedMaxPages) {
      console.log('Reached the end of the New deals feed (page 20).');
      return this;
    }

    const nextPageFeed = await this.newDeals.fetcher(nextPageNumber);

    return new DealsFeed({
      newDeals: {
        ...this.newDeals,
        feed: this.newDeals.feed
          ? DealsFeed.mergeFeeds(this.newDeals.feed, nextPageFeed, DealsFeed.newDealsSorter)
          : nextPageFeed,
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
  private static topDealsSorter: DealsSorter = () => 0;
  private static newDealsSorter: DealsSorter = (deal1, deal2) => deal2.postedAt.getTime() - deal1.postedAt.getTime();
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

export const onlineTopDealsFetchFeed: FeedFetcher = (page = 0) => {
  return getOzbargainFeedFromUrl(`${TOP_DEALS_FEED_URL}?page=${page}`);
};
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
    emptyDealsFeed: DealsFeed;
  };
type Action =
  | {
    type: 'refresh';
  }
  | {
    type: 'set';
    dealsFeed: DealsFeed;
  };

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

type DealsFeedMethods = {
  /** Refresh entire feed. */
  refreshTopDeals: (dealsFeed: DealsFeed) => void;
  /** Refresh entire feed. */
  refreshNewDeals: (dealsFeed: DealsFeed) => void;
  /** Load the next page in the feed. */
  loadTopDealsNextPage: (dealsFeed: DealsFeed) => void;
  /** Load the next page in the feed. */
  loadNewDealsNextPage: (dealsFeed: DealsFeed) => void;
};

type DealsFeedContextProps = MaybeUninitializedState & DealsFeedMethods;
const DealsFeedContext = createContext<DealsFeedContextProps | undefined>(undefined);

export function DealsFeedProvider({
  children,
  topDealsFetchFeed,
  newDealsFetchFeed,
}: React.PropsWithChildren<{
  topDealsFetchFeed: FeedFetcher;
  newDealsFetchFeed: FeedFetcher;
}>): React.JSX.Element {
  const [state, dispatch] = useReducer(dealsFeedReducer, {
    state: 'uninitialised',
    emptyDealsFeed: new DealsFeed({
      topDeals: {
        fetcher: topDealsFetchFeed,
      },
      newDeals: {
        fetcher: newDealsFetchFeed,
      },
    }),
  });

  useEffect(() => {
    if (state.state !== 'uninitialised') {
      return;
    }
    const loadFirstPages = async () => {
      dispatch({ type: 'refresh' });
      const [topDeals, newDeals] = await Promise.all([topDealsFetchFeed(0), newDealsFetchFeed(0)]);
      dispatch({
        type: 'set',
        dealsFeed: new DealsFeed({
          topDeals: {
            feed: topDeals,
            fetcher: topDealsFetchFeed,
            lastFetchedPage: 0,
          },
          newDeals: {
            feed: newDeals,
            fetcher: newDealsFetchFeed,
            lastFetchedPage: 0,
          },
        }),
      });
    };

    void loadFirstPages();
  }, []);

  const value = useMemo<DealsFeedContextProps>(() => {
    return {
      ...state,
      // Need to take dealsFeed as param instead of using state.dealsFeed from this function's closure,
      // because at this point state.dealsFeed may be undefined.
      refreshTopDeals: async dealsFeed => {
        dispatch({ type: 'refresh' });

        const newFeed = await dealsFeed.topDeals.fetcher(0);

        dispatch({
          type: 'set',
          dealsFeed: new DealsFeed({
            topDeals: {
              ...dealsFeed.topDeals,
              feed: newFeed,
              lastFetchedPage: 0,
            },
            newDeals: {
              ...dealsFeed.newDeals,
            },
          }),
        });
      },
      refreshNewDeals: async dealsFeed => {
        dispatch({ type: 'refresh' });

        const newFeed = await dealsFeed.newDeals.fetcher(0);

        dispatch({
          type: 'set',
          dealsFeed: new DealsFeed({
            topDeals: {
              ...dealsFeed.topDeals,
            },
            newDeals: {
              ...dealsFeed.newDeals,
              feed: newFeed,
              lastFetchedPage: 0,
            },
          }),
        });
      },
      loadTopDealsNextPage: async dealsFeed => {
        dispatch({ type: 'refresh' });

        const newDealsFeed = await dealsFeed.loadTopDealsFeedNextPage();

        dispatch({
          type: 'set',
          dealsFeed: newDealsFeed,
        });
      },
      loadNewDealsNextPage: async dealsFeed => {
        dispatch({ type: 'refresh' });

        const newDealsFeed = await dealsFeed.loadNewDealsFeedNextPage();

        dispatch({
          type: 'set',
          dealsFeed: newDealsFeed,
        });
      },
    };
  }, [state, dispatch, topDealsFetchFeed, newDealsFetchFeed]);

  return (
    <DealsFeedContext.Provider value={value}>
      {children}
    </DealsFeedContext.Provider>
  );
}

type UseDealsFeedReturnValue =
  & State
  & {
    [Key in keyof DealsFeedMethods]: () => void;
  };

export function useDealsFeed(): UseDealsFeedReturnValue {
  const context = useContext(DealsFeedContext);
  if (context == null) {
    throw new Error('Could not find DealsFeed Provider');
  }

  // Assuming the app runs single-threaded, this should only occur once.
  // useEffect(() => {
  //   if (context.state === 'uninitialised') {
  //     context.refreshTopDeals(context.emptyDealsFeed);
  //     context.refreshNewDeals(context.emptyDealsFeed);
  //   }
  // }, [context]);

  // Had type errors with assigning `state` when trying to make this smaller using `...context`.
  return context.state === 'uninitialised' || context.state === 'refreshing'
    ? {
      state: 'refreshing',
      dealsFeed: context.dealsFeed,
      refreshTopDeals: () => undefined,
      refreshNewDeals: () => undefined,
      loadTopDealsNextPage: () => undefined,
      loadNewDealsNextPage: () => undefined,
    }
    : {
      state: 'ready',
      dealsFeed: context.dealsFeed,
      refreshTopDeals: () => context.refreshTopDeals(context.dealsFeed),
      refreshNewDeals: () => context.refreshNewDeals(context.dealsFeed),
      loadTopDealsNextPage: () => context.loadTopDealsNextPage(context.dealsFeed),
      loadNewDealsNextPage: () => context.loadNewDealsNextPage(context.dealsFeed),
    };
}
