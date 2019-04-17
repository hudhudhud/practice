import { post } from '../../api/request.js';
//统计查询销售额
export function find_order() {
  return post('/authc/statistics/find_order', arguments);
}
//统计查询自身销量及销售量
export function find_saleroom() {
  return post('/authc/statistics/find_saleroom', arguments);
}
//统计查询余额和临时收益
export function find_account() {
  return post('/authc/statistics/find_account', arguments);
}
//查询上级二维码(培训导师模块)
export function find_parent_qr_code() {
  return post('/authc/user/find_parent_qr_code', arguments);
}
//查询直属团队（直推）
export function find_by_invite_id() {
  return post('/authc/user/find_by_invite_id', arguments);
}
//查询销售单
export function find_market_order_page() {
  return post('/authc/order/find_market_order_page', arguments);
}
//分页查询学习分享
export function findLeanShareList() {
  return post('/authc/study_share/find_page', arguments);
}
//分页查询单个学习分享
export function findLeanShareDetail() {
  return post('/authc/study_share/view', arguments);
}
//银行卡详细信息
export function bank_get_detail() {
  return post('/authc/bank/get_detail', arguments);
}
//添加用户银行卡
export function bankSave() {
  return post('/authc/bank/save', arguments);
}
//编辑用户银行卡
export function bankEdit() {
  return post('/authc/bank/edit', arguments);
}
//删除用户银行卡
export function bankDelete() {
  return post('/authc/bank/delete', arguments);
}
//查询用户银行卡
export function find_bank_list() {
  return post('/authc/bank/find_list_all', arguments);
}
//检测是否设置工资卡
export function check_salary_card() {
  return post('/authc/bank/check_salary_card', arguments);
}
//设置默认卡
export function save_default_card() {
  return post('/authc/bank/save_default_card', arguments);
}
//设置工资卡
export function save_salary_card() {
  return post('/authc/bank/save_salary_card', arguments);
}
//上传文件
export function fileupload() {
  return post('/file/upload', arguments);
}
//通过userid查看实名认证信息
export function findByUserId() {
  return post('/authc/user_indentity/find_by_user_id', arguments);
}
//保存实名认证信息
export function saveAutonymInfo() {
  return post('/authc/user_indentity/save', arguments);
}
//编辑并重置实名认证信息
export function update_and_reset() {
  return post('/authc/user_indentity/update_and_reset', arguments);
}
//查询协议列表
export function protocol_find_all() {
  return post('/authc/user_protocol/find_all', arguments);
}
//查看协议详情
export function protocol_view_detail() {
  return post('/authc/user_protocol/view', arguments);
}
