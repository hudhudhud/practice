import {post} from "./../http";
let publicUrl='/authc/user_rank/'
//会员信息
export function list() {
    return post(publicUrl+'find_page', arguments)
}
export function update_rank() {
    return post(publicUrl+'update_user_rank', arguments)
}
export function view() {
    return post(publicUrl+'view', arguments)
}
//统计团队人数
export function find_user_team_number() {
    return post(publicUrl+'find_user_team_number', arguments)
}
//查询团队推荐关系下级
export function fing_by_invite_id() {
    return post(publicUrl+'fing_by_invite_id', arguments)
}
//查询团队直属下级
export function fing_by_parent_id() {
    return post(publicUrl+'fing_by_parent_id', arguments)
}
//查询团队详情
export function fing_by_team() {
    return post(publicUrl+'fing_by_team', arguments)
}
//会员激活冻结
export function update_user_status() {
    return post(publicUrl+'update_user_status', arguments)
}

//查询会员等级
export function find_user_rank_upgrade_config() {
    return post(publicUrl+'find_user_rank_upgrade_config', arguments)
}
//保存会员等级
export function save_rank_upgrade_config() {
    return post(publicUrl+'save_rank_upgrade_config', arguments)
}

//会员等级变化列表
export function list_rank() {
    return post('/authc/user_rank_Log/find_page', arguments)
}
//用户实名
export function audit_indentity() {
    return post('/authc/user_indentity/audit', arguments)
}
export function list_indentity() {
    return post('/authc/user_indentity/find_page', arguments)
}
export function view_indentity() {
    return post('/authc/user_indentity/view', arguments)
}

//用户协议
export function list_protocol() {
    return post('/authc/user_protocol/find_all_by_user_id', arguments)
}

//用户账户
export function find_user_account() {
    return post('/authc/account/find_user_account', arguments)
}
//用户账户日志

export function list_account_log() {
    return post('/authc/account_log/find_page', arguments)
}
//用户银行卡信息
export function find_salary_card() {
    return post('/authc/bank_card/find_salary_card', arguments)
}
