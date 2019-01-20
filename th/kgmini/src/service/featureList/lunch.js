import { post } from "../httpRequest";

/**
 * 查询午餐收费信息
 * @returns {Promise<*>}
 */
export function queryLunchFee() {
  return post("/schoolLunch/queryLunchFee", arguments);
}

/**
 * 查询午餐收费信息
 * @returns {Promise<*>}
 */
export function alipayLunchOrder() {
  return post("/alipay/lunchOrder", arguments);
}


export function commentSaveLunchComment() {
  return post("/comment/saveLunchComment", arguments);
}

export function saveLunchOrder() {
  return post("/schoolLunch/saveLunchOrder", arguments);
}

export function prePayUnderMini() {
  return post("/schoolLunch/prePayUnderMini", arguments);
}

export function querySupplier() {
  return post("/schoolLunch/querySupplier", arguments);
}

export function commentListLunchComment() {
  return post("/comment/listLunchComment", arguments);
}
