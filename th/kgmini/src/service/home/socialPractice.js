import { post } from "../httpRequest";

export function listActivityTypes() {
  return post("/dict/listActivityTypes", arguments);
}

export function practiseBaseList() {
  return post("/practiseBase/list", arguments);
}

export function practiseBaseDetail() {
  return post("/practiseBase/detail", arguments);
}

export function practiseActivityList() {
  return post("/practiseActivity/list", arguments);
}

export function practiseActivityDetail() {
  return post("/practiseActivity/detail", arguments);
}
