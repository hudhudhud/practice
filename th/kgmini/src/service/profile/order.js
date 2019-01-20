import { post } from "../httpRequest";

export function getOrderList() {
  if(!arguments[0].status)
    delete arguments[0].status
  return post("/courseOrder/list", arguments);
}


export function getOrderDetail() {
  return post("/courseOrder/detail", arguments);
}

export function refundOrder() {
  return post("/courseOrder/refund", arguments);
}
