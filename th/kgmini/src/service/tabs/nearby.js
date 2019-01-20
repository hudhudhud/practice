import { post } from "../httpRequest";

// 附近 机构列表
export function nearbyList() {
  if (!arguments[0].lng) {
    delete arguments[0].lat;
    delete arguments[0].lng;
  }
  return post("/nearby/listNearbyMechanism", arguments);
}


// 适用年级列表
export function listGrades() {
  return post("/dict/listGrades", arguments);
}


// 一级目录列表
export function listFirst() {
  return post("/courseColumn/listFirst", arguments);
}


// 二级目录列表
export function listSecond() {
  return post("/courseColumn/listSecond", arguments);
}
