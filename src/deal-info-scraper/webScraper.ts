import type { CheerioAPI, Element, SelectorType } from 'cheerio';
import { load } from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OZBARGAIN_BASE_URL } from '../base/constants/urls';
import { type PartedText, partText } from '../feed-parser/textParts';

type Comment = {
  /**
   * Comes from the `data-uid` attribute on the wrapper `.comment` div.
   */
  id: string;
  user: {
    name: string;
    thumbnailUrl: string;
    profileUrl: string;
  };
  content: PartedText;
  /**
   * Votes are totalled, so a positive value is upvoted that amount,
   * and negative value is downvoted that amount.
   */
  votes: number;
  /**
   * It seems the times in HTML are always same timezone, maybe AEST?
   * The times can also be relative, eg "36mins ago".
   *
   * BUT, the timestamp can be extracted from the wrapper `.comment` div,
   * in the `data-ts` attribute (do `new Date(data-ts * 1000)`).
   */
  timestamp: Date;
  /**
   * How indented this comment is in a thread.
   *
   * Level 0 == A base comment on the deal,
   * Higher levels are replies to a "level - 1" comment.
   */
  level: number;
  children?: Comment[];
};

const url = `${OZBARGAIN_BASE_URL}/node/888965`;

function getCoupons(html: string): string[] {
  const couponsDiv = html.match(/(?:<div class="couponcode.*?\/div>)/)?.[0];
  const couponStrings = couponsDiv?.matchAll(/(?:<strong>(.+?)<\/strong>)/g);
  if (!couponStrings) {
    console.warn('Found no coupons');
    return [];
  }

  const coupons: string[] = [];
  for (const match of couponStrings) {
    const couponText = match.at(1);
    if (!couponText) {
      console.warn('Found coupon <strong> element but no text within');
      continue;
    }
    coupons.push(couponText);
  }

  return coupons;
}

function getCommentAndChildren(rootCheerio: CheerioAPI, comment: Element, level: number): Comment {
  const $ = (query: SelectorType) => rootCheerio(query, comment);

  const id = $('> div.comment-wrap').attr()?.['id']?.match(/comment-(\d+)/)?.at(1);
  const timestampMs = Number.parseInt($('> div.comment-wrap > div.comment').attr()?.['data-ts'] ?? '0') * 1000;
  if (!id) {
    throw new Error(`Did not find ID for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (timestampMs === 0) {
    throw new Error(`Did not find ID for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const userATag = $('> div.comment-wrap div.submitted a');
  const userName = userATag.text();
  const userLink = userATag.attr()?.href;
  const userThumbnailUrl = $('> div.comment-wrap div.n-left > img').attr()?.src;

  if (!userLink) {
    throw new Error(`Did not find comment author profile link for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (!userThumbnailUrl) {
    throw new Error(`Did not find comment author thumbnail URL for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const votes = Number.parseInt($('> div.comment-wrap span.cvc').text() || '0');

  const contentDiv = $('> div.comment-wrap div.content');
  const contentHtml = contentDiv.html()?.trim() ?? '';

  const children = $('> ul.comment > li').map((_, elem) => getCommentAndChildren(rootCheerio, elem, level + 1)).get();

  return {
    id,
    timestamp: new Date(timestampMs),
    content: partText(contentHtml),
    user: {
      name: userName,
      thumbnailUrl: userThumbnailUrl,
      profileUrl: `${OZBARGAIN_BASE_URL}${userLink}`,
    },
    votes,
    level,
    children,
  };
}

function getComments(html: string) {
  const $ = load(html);
  const level0Comments = $('ul.comment.level0 > li');

  return level0Comments.map((_, elem) => getCommentAndChildren($, elem, 0)).get();
}

export async function main() {
  // const html = await fetch(url).then(res => res.text());
  // await writeFile(join(__dirname, 'deal-info.html'), html);
  const html = await readFile(join(__dirname, 'deal-info.html'), 'utf-8');

  const coupons = getCoupons(html);
  console.log(coupons);

  const comments = getComments(html);
  console.dir(comments, { depth: null });
}

void main();
