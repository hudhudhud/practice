import { post } from "../httpRequest";

export function createOrder() {
  return post("/courseOrder/enroll", arguments);
}

/**
 * 获取订单详情
 * @returns {Promise<*>}
 */
export function courseOrderDetail() {
  return post("/courseOrder/detail", arguments);
}

/**
 * 获取微信支付的 信息
 * @returns {Promise<*>}
 */
export function getWxPayInfo() {
  return post("/courseOrder/prePayUnderMini", arguments);
}
