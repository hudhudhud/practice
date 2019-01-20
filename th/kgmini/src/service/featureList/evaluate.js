import { post } from "../httpRequest";

export function commentListCourse() {
  return post("/comment/listCourse", arguments);
}

export function commentlistTeacherComment() {
  return post("/comment/teacherCommentDetail", arguments);
}
