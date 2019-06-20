import axios from 'axios'
import common from './common.js'
var myaxios={
	get(url){

		//请求若要带上cookie需要设置axios，且后端也需要设置Origin为指定域名
		axios.defaults.withCredentials = true
		return axios.get(common.apiUrl+url)
	},
	post(url,op){
		return axios.post(common.apiUrl+url,op)
	}
}
export default myaxios