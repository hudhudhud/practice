import { post, getBody } from './http';

const url = '/rest/customerTeam';

// 查询团队分布
export function findNumberByRank(params) {
    return post(url + '/findNumberByRank', getBody(params));
}
// 获取列表数据
export function findTeamPage(params) {
    return post(url + '/findTeamPage',  getBody(params))

}
