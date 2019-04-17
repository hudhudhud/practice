import { post } from '../../api/request.js';
export function getBannar() {
  return post('/authc/banner/find_all', arguments);
}
export function getShopList() {
  return post('/authc/product/find_page', arguments);
}