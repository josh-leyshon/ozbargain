import { load } from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { PartedText } from '../feed-parser/textParts';

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
   * If a comment is downvoted, it is displayed on the site greyer than others.
   * The "level" of greyness is in the html.
   * It seems to literally match the number of downvotes, from -1 to -3.
   * A higher value here means "greyer".
   */
  deEmphasis?: 1 | 2 | 3;
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

const url = 'https://www.ozbargain.com.au/node/888965';

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

function getComments(html: string) {
  const $ = load(html);
  const level0Comments = $('ul.comment.level0 > li');

  return level0Comments.map((_, elem) => {
    return $('> div.comment-wrap div.content', elem).text();
  }).get();
}

export async function main() {
  // const html = await fetch(url).then(res => res.text());
  // await writeFile(join(__dirname, 'deal-info.html'), html);
  const html = await readFile(join(__dirname, 'deal-info.html'), 'utf-8');

  const coupons = getCoupons(html);
  console.log(coupons);

  const comments = getComments(html);
  console.log(comments);
}

void main();
