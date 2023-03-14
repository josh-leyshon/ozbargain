import type { RssFeed } from './parser';

type FeedMeta = {
  title: string;
  link: string;
};

type FeedItem = {
  title: string;
  content: string;
  /** Has HTML stripped. */
  contentSnippet: string;
  creator: string;
  isoDate: Date;
  id: number;
  link: string;
  comments: string;
  categories: {
    name: string;
    link: string;
  }[];
  meta: {
    'comment-count': number;
    expiry?: Date;
    image?: string;
    url: string;
    'votes-pos': number;
    'votes-neg': number;
  };
};

function assert(value: unknown, message?: string): asserts value {
  console.assert(value, message);
}

export function assertFeedMeta(
  feed: RssFeed,
): asserts feed is RssFeed & FeedMeta {
  assert(feed.title != null);
  assert(feed.link != null);
}

function assertItemCategories(
  categories: unknown,
): asserts categories is { _: string; $: { domain: string } }[] {
  assert(
    Array.isArray(categories) &&
      categories.every(
        (category: unknown) =>
          category &&
          typeof category === 'object' &&
          '_' in category &&
          typeof category._ === 'string' &&
          '$' in category &&
          category.$ &&
          typeof category.$ === 'object' &&
          'domain' in category.$ &&
          typeof category.$.domain === 'string',
      ),
  );
}

// Also converts item.categories into a correct string[] type,
// since ozbargain feed <category> elements also contain attributes
// that are parsed but not reflected in the RssFeed type.
export function assertAndParseFeedItem(
  item: RssFeed['items'][number],
): FeedItem {
  assert(item.title != null);
  assert(item.content != null);
  assert(item.contentSnippet != null);
  assert(item.creator != null);
  assert(item.isoDate != null);
  assert(item.link != null);
  assert(typeof item.comments === 'string');

  assert(item.guid != null);
  const idStr = item.guid.match(/\d+/)?.[0];
  assert(
    idStr != null,
    `Could not extract deal number in guid string: ${item.guid}`,
  );
  const id = Number.parseInt(idStr, 10);

  // Workaround to remove the incorrect `string[]` type from `item.categories`,
  // before asserting its correct type.
  // eslint-disable-next-line prefer-destructuring
  const categories: unknown = item.categories;
  assertItemCategories(categories);

  const meta = item['ozb:meta']?.$;
  assert(meta != null);
  assert(typeof meta['comment-count'] === 'string');
  assert(meta.expiry == null || typeof meta.expiry === 'string');
  assert(meta.image == null || typeof meta.image === 'string');
  assert(typeof meta.url === 'string');
  assert(typeof meta['votes-pos'] === 'string');
  assert(typeof meta['votes-neg'] === 'string');

  return {
    title: item.title,
    content: item.content,
    contentSnippet: item.contentSnippet,
    creator: item.creator,
    isoDate: new Date(item.isoDate),
    id,
    link: item.link,
    comments: item.comments,
    categories: categories.map(category => ({
      name: category._,
      link: category.$.domain,
    })),
    meta: {
      'comment-count': Number.parseInt(meta['comment-count'], 10),
      expiry: meta.expiry != null ? new Date(meta.expiry) : undefined,
      image: meta.image,
      url: meta.url,
      'votes-pos': Number.parseInt(meta['votes-pos'], 10),
      'votes-neg': Number.parseInt(meta['votes-neg'], 10),
    },
  };
}
