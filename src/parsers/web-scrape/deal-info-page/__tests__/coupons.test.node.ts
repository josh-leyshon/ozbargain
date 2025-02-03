import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDealCouponsFromDocument } from '../coupons';

const dealInfoHtml = readFileSync(join(__dirname, 'fixtures', 'deal-info.html'), 'utf-8');

test('Extracts coupons from deal info page', () => {
  expect(getDealCouponsFromDocument(dealInfoHtml)).toStrictEqual(['20off', 'TAKE10']);
});
