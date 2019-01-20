import { post } from "../httpRequest";

export function childListByParentId() {
  return post("/student/listByParentId", arguments);
}

// 根据验证码 搜索子女信息
export function queryDetailByBindCode() {
  return post("/student/queryDetailByBindCode", arguments);
}

// 校外子女绑定
export function saveStudent() {
  return post("/student/save", arguments);
}

// 家长绑定 子女
export function bindParent() {
  return post("/student/bindParent", arguments);
}
