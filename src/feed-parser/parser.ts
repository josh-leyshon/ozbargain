import RssParser from 'rss-parser';
import { assertAndParseFeedItem, assertFeedMeta } from './assertions';
import { type PartedText, partText } from './textParts';

export type Deal = {
  id: string;
  title: PartedText;
  description: string;
  author: string;
  postedAt: Date;
  expiresAt?: Date;
  links: {
    deal: string;
    comments: string;
    productPage: string;
  };
  votes: {
    positive: number;
    negative: number;
  };
  commentCount: number;
  thumbnailUrl?: string;
  categories: {
    name: string;
    link: string;
  }[];
};

export type OzbargainFeed = {
  meta: {
    feedTitle: string;
    feedLink: string;
  };
  deals: Deal[];
};

// Note: New fields must be optional because otherwise the rss-parser types incorrectly assume these fields will always be present.
// Compare this to the other built-in fields that rss-parser supports, which are optional by default.
type RssParserCustomItemFields = {
  comments?: string;
  'ozb:meta'?: {
    $: {
      'comment-count'?: string;
      expiry?: string;
      image?: string;
      url?: string;
      'votes-pos'?: string;
      'votes-neg'?: string;
    };
  };
};
export type RssFeed = RssParser.Output<RssParserCustomItemFields>;

export function getRssParser() {
  return new RssParser<unknown, RssParserCustomItemFields>({
    customFields: { item: ['comments', 'ozb:meta'] },
  });
}

/**
 * Asserts and parses feed into a simpler structure for ozbargain deals.
 */
export function convertToOzbargainFeed(feed: RssFeed): OzbargainFeed {
  assertFeedMeta(feed);
  return {
    meta: {
      feedTitle: feed.title,
      feedLink: feed.link,
    },
    deals: feed.items.map(item => {
      const feedItem = assertAndParseFeedItem(item);

      return {
        title: partText(feedItem.title),
        description: feedItem.contentSnippet,
        author: feedItem.creator,
        postedAt: feedItem.isoDate,
        id: feedItem.id,
        links: {
          deal: feedItem.link,
          comments: feedItem.comments,
          productPage: feedItem.meta.url,
        },
        votes: {
          positive: feedItem.meta['votes-pos'],
          negative: feedItem.meta['votes-neg'],
        },
        commentCount: feedItem.meta['comment-count'],
        categories: feedItem.categories,
        ...(feedItem.meta.expiry != null && { expiresAt: feedItem.meta.expiry }),
        ...(feedItem.meta.image != null && { thumbnailUrl: feedItem.meta.image }),
      };
    }),
  };
}

export async function getOzbargainFeedFromUrl(url: string) {
  const feedText = await fetch(url).then(res => res.text());
  const parsedFeed = await getRssParser().parseString(feedText);

  return convertToOzbargainFeed(parsedFeed);
}

// FOR LOCAL TESTING ONLY

export const FEED_URL = 'https://www.ozbargain.com.au/deals/feed';
export const FEED_URL_CORS_ANYWHERE = `https://cors-anywhere.herokuapp.com/${FEED_URL}`;
