import { post } from "../httpRequest";

export function updateInfo() {
  return post("/teacher/update", arguments);
}
