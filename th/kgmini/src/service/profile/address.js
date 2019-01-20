import { post } from "../httpRequest";

export function getAddressList() {
  return post("/userAddress/list", arguments);
}

export function addAddress() {
  return post("/userAddress/add", arguments);
}
