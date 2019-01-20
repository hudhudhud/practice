import { post } from "../httpRequest";

export function getShowList() {
  if(!arguments[0].studentId)
    delete arguments[0].studentId;
  return post("/courseStyle/list", arguments);
}

export function getShowDetail() {
  return post("/courseStyle/detail", arguments);
}
