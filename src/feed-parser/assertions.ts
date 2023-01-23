import { strict as assert } from "assert";
import type { RssFeed } from "./parser";

type FeedMeta = {
  title: string;
  link: string;
};

export function assertFeedMeta(
  feed: RssFeed
): asserts feed is RssFeed & FeedMeta {
  assert(feed.title != null);
  assert(feed.link != null);
}

type FeedItem = {
  title: string;
  content: string;
  /** Has HTML stripped. */
  contentSnippet: string;
  isoDate: Date;
  id: number;
  link: string;
  comments: string;
  categories: {
    name: string;
    link: string;
  }[];
  meta: {
    "comment-count": number;
    expiry?: Date;
    image?: string;
    url: string;
    "votes-pos": number;
    "votes-neg": number;
  };
};

// Also converts item.categories into a correct string[],
// since ozbargain feed <category> elements also contain attributes
// that are parsed but not reflected in the RssFeed type.
export function assertFeedItem(item: RssFeed["items"][number]): FeedItem {
  assert(item.title != null);
  assert(item.content != null);
  assert(item.contentSnippet != null);
  assert(item.isoDate != null);
  assert(item.link != null);
  assert(item.comments != null && typeof item.comments === "string");

  assert(item.guid != null);
  const idStr = item.guid.match(/\d+/)?.[0];
  assert(
    idStr != null,
    `Could not extract deal number in guid string: ${item.guid}`
  );
  const id = Number.parseInt(idStr, 10);

  assert(
    Array.isArray(item.categories) &&
      item.categories.every(
        (item: any) =>
          item?._ != null &&
          typeof item?._ === "string" &&
          item?.$?.domain != null &&
          typeof item?.$?.domain === "string"
      )
  );

  const meta = item["ozb:meta"].$;
  assert(meta != null);
  assert(
    meta["comment-count"] != null && typeof meta["comment-count"] === "string"
  );
  assert(meta.expiry == null || typeof meta.expiry === "string");
  assert(meta.image == null || typeof meta.image === "string");
  assert(meta.url != null && typeof meta.url === "string");
  assert(meta["votes-pos"] != null && typeof meta["votes-pos"] === "string");
  assert(meta["votes-neg"] != null && typeof meta["votes-neg"] === "string");

  return {
    title: item.title,
    content: item.content,
    contentSnippet: item.contentSnippet,
    isoDate: new Date(item.isoDate),
    id,
    link: item.link,
    comments: item.comments,
    categories: (item.categories as any[]).map((item) => ({
      name: item._,
      link: item.$.domain,
    })),
    meta: {
      "comment-count": Number.parseInt(meta["comment-count"], 10),
      expiry: meta.expiry != null ? new Date(meta.expiry) : undefined,
      image: meta.image,
      url: meta.url,
      "votes-pos": Number.parseInt(meta["votes-pos"], 10),
      "votes-neg": Number.parseInt(meta["votes-neg"], 10),
    },
  };
}
