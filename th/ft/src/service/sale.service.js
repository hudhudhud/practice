import { post, getBody } from './http';


export function getData(params={}) {
    return post('rest/customerSales/monthSales', getBody(params));
}
