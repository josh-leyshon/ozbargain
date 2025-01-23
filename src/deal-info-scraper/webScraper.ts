/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import cheerio, { type DollarResult } from 'react-native-cheerio';

const url = 'https://www.ozbargain.com.au/node/888965';

function getCoupons(html: string): string[] {
  const couponsDiv = html.match(/(?:<div class="couponcode.*?\/div>)/)?.[0];
  const couponStrongs = couponsDiv?.matchAll(/(?:<strong>(.+?)<\/strong>)/g);
  if (!couponStrongs) {
    console.warn('Found no coupons');
    return [];
  }

  const coupons: string[] = [];
  for (const match of couponStrongs) {
    const couponText = match.at(1);
    if (!couponText) {
      console.warn('Found coupon <strong> element but no text within');
      continue;
    }
    coupons.push(couponText);
  }

  return coupons;
}

function getCommentsFromThread(thread: DollarResult) {
  const comment = thread.children('div.comment-wrap');
  console.log(comment.text());
}

function getComments(html: string) {
  const $ = cheerio.load(html);
  const level0Comments = $('ul.comment.level0 > li');

  return level0Comments.map((_: any, elem: any) => {
    return $('> div.comment-wrap div.content', elem).text();
  }).get();
}

export async function main() {
  const html = await fetch(url).then(res => res.text());
  // await writeFile(join(__dirname, 'deal-info.html'), html);

  const coupons = getCoupons(html);
  console.log(coupons);

  const comments = getComments(html);
  console.log(comments);
}

void main();
