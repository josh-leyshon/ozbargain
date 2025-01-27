import { load } from 'cheerio';

/**
 * Extract the coupons on a deal info page, if it has any.
 * @param html The HTML of a deal info page.
 */
export function getDealCouponsFromDocument(html: string): string[] {
  const $ = load(html);

  const coupons = $('div.couponcode strong').map((_, elem) => $(elem).text()).get();

  return coupons;
}
