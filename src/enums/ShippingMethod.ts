export enum ShippingMethod {
  'sevenEleven' = '711',

  'largeBox' = '超大材積貨運',

  'family' = '全家',

  'blackCat' = '黑貓宅急便',

  'pickUp' = '自取(請加官方LINE預約取件時間)',
}
export function getShippingMethodName(
  key: keyof typeof ShippingMethod | string
): string {
  if (key in ShippingMethod) {
    return ShippingMethod[key as keyof typeof ShippingMethod];
  }
  return '未知的運送方式';
}
