import { post } from "../httpRequest";

export function listTodayCourses() {
  return post("/teacher/listTodayCourses", arguments);
}

export function teacherDetail() {
  return post("/teacher/detail", arguments);
}

export function stopTodayCourse() {
  return post("/teacher/stopTodayCourse", arguments);
}

export function listStudent() {
  return post("/teacher/listStudent", arguments);
}

export function listCourseLeave() {
  return post("/teacher/listCourseLeave", arguments);
}

export function saveStudentCall() {
  if(!arguments[0].comment){
    delete arguments[0].comment;
  }
  return post("/teacher/saveStudentCall", arguments);
}

export function listTeacherCourse() {
  return post("/courseTable/listTeacherCourse", arguments);
}

export function commentListStudent() {
  return post("/comment/listStudent", arguments);
}
export function studentDetail() {
  return post("/student/detail", arguments);
}

export function commentTeacherListComment() {
  if (!arguments[0].status)
    delete arguments[0].status
  return post("/comment/listComment", arguments);
}

export function saveCourseStyle() {
  return post("/courseStyle/save", arguments);
}


export function listImprovementComment() {
  return post("/comment/listImprovement", arguments);
}

export function saveTeacherComment() {
  return post("/comment/saveTeacherComment", arguments);
}
