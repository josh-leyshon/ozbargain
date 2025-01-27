import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OZBARGAIN_BASE_URL } from '../base/constants/urls';
import { getDealCommentsFromDocument } from '../parsers/web-scrape/deal-info-page/comments';
import { getDealCouponsFromDocument } from '../parsers/web-scrape/deal-info-page/coupons';

const url = `${OZBARGAIN_BASE_URL}/node/888965`;

export async function main() {
  // const html = await fetch(url).then(res => res.text());
  // await writeFile(join(__dirname, 'deal-info.html'), html);
  const html = await readFile(join(__dirname, 'deal-info.html'), 'utf-8');

  const coupons = getDealCouponsFromDocument(html);
  console.log(coupons);

  const comments = getDealCommentsFromDocument(html);
  console.dir(comments, { depth: null });
}

void main();
