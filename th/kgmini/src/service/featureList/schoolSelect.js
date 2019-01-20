import { post } from "../httpRequest";

export function list2Student() {
  return post("/courseTable/list2Student", arguments);
}
export function list2Teacher() {
  return post("/courseTable/list2Teacher", arguments);
}

export function courseTableDetail() {
  return post("/courseTable/detail", arguments);
}

export function saveCourseTable() {
  return post("/courseTable/save", arguments);
}
