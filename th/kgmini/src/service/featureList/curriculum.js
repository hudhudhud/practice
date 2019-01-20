import { post } from "../httpRequest";

export function getCourseList() {
  return post("/course/list", arguments);
}
