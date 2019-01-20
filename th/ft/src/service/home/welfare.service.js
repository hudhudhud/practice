import { post, getBody } from '../http';


// 获取福利商品收益值
export function findWelfareValue(params = {}) {
    return post('/rest/productwelfare/findWelfareValue', getBody(params));
}

// 获取福利商品 列表 首页
export function findWelfarePage(params = {}) {
    return post('/product/findWelfarePage', getBody(params));
}
