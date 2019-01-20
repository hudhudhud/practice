import { post } from "../httpRequest";

export function getInstitutionDetail() {
  return post("/mechanism/detail", arguments);
}


/**
 * 获取机构 下的 评价列表
 * @returns {Promise<*>}
 */
export function listMechanismComment() {
  if (!arguments[0].eduStatus)
    delete arguments[0].eduStatus
  return post("/comment/listMechanismComment", arguments);
}
