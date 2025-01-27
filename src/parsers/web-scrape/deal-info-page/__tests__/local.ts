import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getDealCommentsFromDocument } from '../comments';
import { getDealCouponsFromDocument } from '../coupons';

export async function main() {
  const html = await readFile(join(__dirname, 'fixtures', 'deal-info.html'), 'utf-8');

  const coupons = getDealCouponsFromDocument(html);
  console.log(coupons);

  const comments = getDealCommentsFromDocument(html);
  console.dir(comments, { depth: null });
}

void main();
