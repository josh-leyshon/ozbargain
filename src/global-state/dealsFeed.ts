import { createContext, useContext, useEffect, useState } from 'react';
import { getOzbargainFeedFromUrl } from '../feed-parser/parser';
import type { OzbargainFeed } from '../feed-parser/parser';

type Deal = OzbargainFeed['deals'][number];

const FEED_URL = 'https://www.ozbargain.com.au/deals/feed';

export class FeedGetter {
  #feed: OzbargainFeed;

  #fetchFeed: () => Promise<OzbargainFeed>;

  private constructor(
    feed: OzbargainFeed,
    fetchFeed: () => Promise<OzbargainFeed>,
  ) {
    this.#feed = feed;
    this.#fetchFeed = fetchFeed;
  }

  static async makeFeedGetter(
    fetchFeed: () => Promise<OzbargainFeed>,
  ): Promise<FeedGetter> {
    return new FeedGetter(await fetchFeed(), fetchFeed);
  }

  getDeals(): Deal[] {
    return this.#feed.deals;
  }

  getDealById(id: Deal['id']): Deal {
    const foundDeal = this.#feed.deals.find(deal => deal.id === id);
    if (!foundDeal) {
      throw new Error(`Unable to find deal with ID ${id}`);
    }
    return foundDeal;
  }

  getFeedMeta(): OzbargainFeed['meta'] {
    return this.#feed.meta;
  }

  async refreshFeed(): Promise<void> {
    this.#feed = await this.#fetchFeed();
  }
}

// Disabled rule because this function doesn't require async,
// but where it's used later it is expected to return a Promise.
// eslint-disable-next-line @typescript-eslint/require-await
export async function localFetchFeed(): Promise<OzbargainFeed> {
  // Fails to find file if string is extracted to a variable, for some reason.
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-unsafe-assignment
  const feed: OzbargainFeed = require('../feed-parser/tests/fixtures/parsed-ozbargain-rss');

  // Turn date strings back into dates.
  feed.deals = feed.deals.map(deal => ({
    ...deal,
    postedAt: new Date(deal.postedAt),
    expiresAt: deal.expiresAt != null ? new Date(deal.expiresAt) : undefined,
  }));

  return feed;
}

export async function onlineFetchFeed(): Promise<OzbargainFeed> {
  return getOzbargainFeedFromUrl(FEED_URL);
}

/** Should be used as a value to FeedContext once created. */
export function useMakeFeedGetter(
  makeFeedGetter: () => Promise<FeedGetter>,
): FeedGetter | undefined {
  const [feedGetter, setFeedGetter] = useState<FeedGetter>();

  useEffect(
    () => {
      const func = async () => {
        setFeedGetter(await makeFeedGetter());
      };

      func().catch((err: unknown) => {
        throw err;
      });
    },
    // We only want to run this effect once, but specifying `makeFeedGetter` in the dependencies
    // causes the effect to run every re-render.
    // Wrapping `makeFeedGetter` in a `useCallback` in top-level also doesn't help.
    // Don't know why :(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return feedGetter;
}

export const FeedContext = createContext<FeedGetter | null>(null);

/**
 * FeedContext value must have already been set to a non-null value earlier in tree.
 * This is a workaround to initialising FeedContext with an async value,
 * but accessing it sync everywhere else.
 */
export function useFeed(): FeedGetter {
  const feed = useContext(FeedContext);
  if (!feed) {
    throw new Error('FeedContext value is null');
  }
  return feed;
}
