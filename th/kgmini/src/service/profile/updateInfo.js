import { post } from "../httpRequest";

export function updateInfo() {
  return post("/user/update", arguments);
}

export function updateTeacherInfo() {
  return post("/teacher/update", arguments);
}

export function updatePassword() {
  return post("/user/updatePassword", arguments);
}

export function passwordSendCode() {
  return post("/user/passwordSendCode", arguments);
}
export function updateUserPassword() {
  return post("/user/updateUserPassword", arguments);
}
export function forgetPassword() {
  return post("/user/forgetPassword", arguments);
}

