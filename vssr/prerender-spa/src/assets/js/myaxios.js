import axios from 'axios'
import common from './common.js'

axios.create({
	baseURL: common.apiUrl,
	//timeout: 1000,
});


var myaxios={
	get(url,op){

		//允许跨域携带cookie
		axios.defaults.withCredentials = true
		if(op){
			op={params:op}
		}
		return axios.get(url,op)
	},
	post(url,op){
		if(typeof FormData !== 'undefined'){
			var fd = new FormData()
			for(let key in op){
				fd.append(key, op[key])
			}
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			axios.defaults.withCredentials = true
			return axios.post(url,fd,config)
		}
		else{
			return this.sendData(common.apiUrl+url,op)
		}
	},
	sendData(url,data) {
		return new Promise(function(resolve, reject) {
			var XHR = new XMLHttpRequest();
			var urlEncodedData = "";
			var urlEncodedDataPairs = [];
			var name;
		
			// Turn the data object into an array of URL-encoded key/value pairs.
			if(data){
				for(name in data) {
					urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
				}
			}
		
			// 空格替换成加号; matches the behaviour of browser form submissions.
			urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
		
			XHR.addEventListener('load', function(event) {
				if (XHR.status == 200) {
					resolve({"data":JSON.parse(XHR.responseText)});
				} else {
					reject(Error(XHR.statusText));
				}
			})

			XHR.addEventListener('error', function(event) {
				reject(Error("Network Error"));
			})

			XHR.open('POST', url);
			XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			XHR.send(urlEncodedData);
		})
	},
}

export default myaxios