import { post } from "../httpRequest";

export function bannerList() {
  return post('/banner/list', arguments);
}

export function noticeList() {
  return post('/notice/list', arguments);
}

export function noticeDetail() {
  return post('/notice/detail', arguments);
}

// 搜索接口
export function searchInfo() {
  return post('/course/list', arguments);
}

export function partnerDetail() {
  return post('/partner/detail', arguments);
}

export function getMechanismList() {
  if(!arguments[0].name){
    delete arguments[0].name;
  }
  if(!arguments[0].lng){
    delete arguments[0].lng;
    delete arguments[0].lat;
  }
  return post('/mechanism/list', arguments);
}
