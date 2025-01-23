// 定義枚舉型別
export enum ShipmentStatus {
  PREPARING_SHIPMENT = '準備發貨',
  SHIPPED = '已發貨',
  SOLD_OUT = '售罄',
  NO_PAY = '未付款',
  FAILED_PAYMENT = '付款失敗',
}

// 根據枚舉的 key 取得對應的值
export function getShipStatusByKey(key: keyof typeof ShipmentStatus): string {
  if (Object.prototype.hasOwnProperty.call(ShipmentStatus, key)) {
    return ShipmentStatus[key];
  }
  return '未知的狀態';
}

// 根據值取得對應的 key
export function getShipKeyByStatus(value: string): string {
  const key = Object.keys(ShipmentStatus).find(
    (k) => ShipmentStatus[k as keyof typeof ShipmentStatus] === value
  );
  return key ?? '未知的狀態';
}
