import { post } from "../httpRequest";

export function invoiceList2Claim() {
  return post("/invoice/list2Claim", arguments);
}

export function invoiceDetail() {
  return post("/invoice/claim", arguments);
}
