import { post, getBody } from './http';

const url = '/rest/customer';
// getHobbyList
export function getHobbyList(params) {
    return post(url+'/getHobbyList', getBody(params));
}
export function getJobList(params) {
    return post(url+'/getJobList', getBody(params));
}
// getCustomer
export function getCustomer(params) {
    return post(url+'/getCustomer', getBody(params)).then(
        res => {
            return Object.assign({},res.data, {status: res.status});
        }
    );
}
// updateUserAvatar
export function updateUserAvatar(params) {
    return post(url+'/updateUserAvatar', getBody(params));
}
export function updateGender(params) {
    return post(url+'/updateGender', getBody(params));
}
export function updateNickname(params) {
    return post(url+'/updateNickName', getBody(params));
}
// updateBirthday
export function updateBirthday(params) {
    return post(url+'/updateBirthday', getBody(params));
}
// updateHobby
export function updateHobby(params) {
    return post(url+'/updateHobby', getBody(params));
}
// updateJob
export function updateJob(params) {
    return post(url+'/updateJob', getBody(params));
}
// updateIdentify
export function updateIdentify(params) {
    return post(url+'/updateIdentify', getBody(params));
}
// updateHomeAddress
export function updateHomeAddress(params) {
    return post(url+'/updateHomeAddress', getBody(params));
}
// addBankCardCheck
export function addBankCardCheck(params={}) {
    return post('/rest/customerAccount'+'/addBankCardCheck', getBody(params));
}
// findCashDepositSum
export function findCashDepositSum(params={}) {
    return post('/rest/customerAccount'+'/findCashDepositSum', getBody(params));
}
// 实名认证 获取信息
export function findOneCustomerInfo(params={}) {
    return post('/rest/customerInfo/findOneCustomerInfo', getBody(params));
}
// 实名认证 证件类型
export function getCardTypeList(params={}) {
    return post('/rest/customerInfo/getCardTypeList', getBody(params));
}
// 实名认证
export function createCustomerInfo(params={}) {
    if(params.confirmStatus ===3 ||params.confirmStatus ===2){
        return post('/rest/customerInfo/updateCustomerInfo', getBody(params));
    } else {
        return post('/rest/customerInfo/createCustomerInfo', getBody(params));
    }
}

// 获取个人订单 数量
export function getOrderCount(params={}) {
    return post('/rest/order/getOrderCount', getBody(params));
}

// 获取 冻结金额详情
export function getForzenAccount (params={}) {
    return post('/rest/customerAccount/getForzenAccount', getBody(params));
}

// 退出登录 loginOut
export function loginOut (params={}) {
    return post(url+'/loginOut', getBody(params));
}
// 今日订单量
export function findCountByCustomer (params={}) {
    return post('/rest/order/findCountByCustomer', getBody(params));
}
// 今日销售额 findAmountByCustomer
export function findAmountByCustomer (params={}) {
    return post('/rest/order/findAmountByCustomer', getBody(params));
}
//获取会员
export function findCustomerRank (params={}) {
    return post('/rest/customer/findCustomerRank', getBody(params));
}