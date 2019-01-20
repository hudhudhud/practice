import { post } from "../httpRequest";

export function saveFeedback() {
  return post("/feedback/save", arguments);
}


export function commentListMyComment() {
  return post("/comment/listMyComment", arguments);
}

export function commentDelete() {
  return post("/comment/delete", arguments);
}

export function cancelFavorite() {
  return post("/favorite/cancel", arguments);
}
// 保存家长对机构、教师、课程评价信息
export function saveMechanismComment() {
  return post("/comment/saveMechanismComment", arguments);
}
