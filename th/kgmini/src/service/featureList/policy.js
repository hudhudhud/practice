import { post } from "../httpRequest";

export function getInsuranceList() {
  return post("/insurance/list", arguments);
}

export function getInsuranceListOrder() {
  return post("/insurance/listOrder", arguments);
}
