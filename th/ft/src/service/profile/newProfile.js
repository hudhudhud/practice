import { post, getBody } from '../http';

const url = '/rest/stat';

// 我的  页面 获取 数据
export function newProfileData(params={}) {
    return post(url + '/getIndexSales', getBody(params));
}
// 获得指标
export function findTeamSales(params={}) {
    return post('/rest/customerTeam/findTeamSales', getBody(params));
}
// 获取 省了多少钱 getSaveMoney
export function getSaveMoney(params={}) {
    return post('/rest/order/getSaveMoney', getBody(params));
}
// 收益 页面  获取 统计
export function getTotal(params={}) {
    return post(url + '/getSumAmount', getBody(params));
}
// 月结收益
export function getMonthEarnings(params={}) {
    return post(url + '/getMonthEarnings', getBody(params));
}
// 后面
export function getMonthEarningsSummary(params={}) {
    return post(url + '/getMonthEarningsSummary', getBody(params));
}

// 收益 订单 数据 getEarningsOrderList
export function getEarningsOrderList(params={}) {
    return post(url + '/getEarningsOrderList', getBody(params));
}
// 销售额 数据
export function orderOutingFindPage(params={}) {
    return post('/rest/order/outingFindPage', getBody(params));
}
// 期权
export function findShareoPtion(params={}) {
    return post(url + '/findShareoPtion', getBody(params));
}
// 我的成长   团队分部
export function findTeamNumberByRank(params={}) {
    return post(url + '/findTeamNumberByRank', getBody(params));
}

//获取今日业绩
export function getTodayPerformance(params={}) {
    return post('/rest/stat/getTodayPerformance', getBody(params));
}
//获取月业绩
export function getMonthPerformance(params={}) {
    return post('/rest/stat/getMonthPerformance', getBody(params));
}

// 待发放 getSumDelayAmount
export function getSumDelayAmount(params={}) {
    return post(url + '/getSumDelayAmount', getBody(params));
}
// 晋升差额
export function getUpgradeProgress(params={}) {
    return post('/rest/customer/getUpgradeProgress',getBody(params));
}