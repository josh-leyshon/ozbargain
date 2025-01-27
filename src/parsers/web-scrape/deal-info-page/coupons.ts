/**
 * Extract the coupons on a deal info page, if it has any.
 * @param html The HTML of a deal info page.
 */
export function getDealCouponsFromDocument(html: string): string[] {
  const couponsDiv = html.match(/(?:<div class="couponcode.*?\/div>)/)?.[0];
  const couponStrings = couponsDiv?.matchAll(/(?:<strong>(.+?)<\/strong>)/g);
  if (!couponStrings) {
    return [];
  }

  const coupons: string[] = [];
  for (const match of couponStrings) {
    const couponText = match.at(1);
    if (!couponText) {
      console.warn(
        'Found coupon <strong> element but no text within. Ignoring this coupon. Deal info html:',
        couponsDiv,
      );
      continue;
    }
    coupons.push(couponText);
  }

  return coupons;
}
