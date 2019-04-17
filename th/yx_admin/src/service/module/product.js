import {post} from "./../http";

let publicUrl='/authc/product/'

//按id删除商品
export function del() {
    return post(publicUrl+'delete', arguments)
}
//分页获取商品信息
export function list() {
    return post(publicUrl+'find_page', arguments)
}

//按id下架商品
export function put_off() {
    return post(publicUrl+'put_off', arguments)
}
//按id上架商品
export function put_on() {
    return post(publicUrl+'put_on', arguments)
}
//保存商品
export function save() {
    return post(publicUrl+'save', arguments)
}
//批量按id下架商品
export function batch_put_off() {
    return post(publicUrl+'batch_put_off', arguments)
}

//批量上架商品
export function batch_put_on() {
    return post(publicUrl+'batch_put_on', arguments)
}
//批量删除商品
export function batch_delete() {
    return post(publicUrl+'batch_delete', arguments)
}

//更新商品基本信息
export function update_base() {
    return post(publicUrl+'update_base', arguments)
}
//更新商品运费和详情
export function update_detail() {
    return post(publicUrl+'update_detail', arguments)
}
//更新商品健康信息
export function update_health() {
    return post(publicUrl+'update_health', arguments)
}
//更新商品价格库存信息
export function update_price_stock() {
    return post(publicUrl+'update_price_stock', arguments)
}
//按ID获取商品信息
export function view() {
    return post(publicUrl+'view', arguments)
}
//按ID获取商品基本信息
export function view_base_by_id() {
    return post(publicUrl+'view_base_by_id', arguments)
}
//按ID获取运费及商品详情信息
export function view_detail_by_id() {
    return post(publicUrl+'view_detail_by_id', arguments)
}
//按ID获取商品健康信息
export function view_health_by_id() {
    return post(publicUrl+'view_health_by_id', arguments)
}
//按ID获取商品价格与库存信息
export function view_price_stock_by_id() {
    return post(publicUrl+'view_price_stock_by_id', arguments)
}

//产品出库
export function out_stock() {
    return post('/authc/product_stock/out_stock', arguments)
}

//产品入库
export function in_stock() {
    return post('/authc/product_stock/in_stock', arguments)
}
//产品出入库流水
export function list_stock_flow() {
    return post('/authc/product_stock/list_flow', arguments)
}
//产品出入库日志
export function view_stock() {
    return post('/authc/product_stock/view', arguments)
}

//导出产品
export function export2Excel() {
    return post('/authc/product/export2Excel', arguments)
}


//商品奖励收益
export function award_view() {
    return post('/authc/product_sku_bonus/view', arguments)
}

export function award_update() {
    return post('/authc/product_sku_bonus/update', arguments)
}

export function award_save() {
    return post('/authc/product_sku_bonus/save', arguments)
}
