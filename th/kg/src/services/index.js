import Urls from './url';
import Fetch from './fetch.js';

let fn = {};
Object.keys(Urls).forEach(key => {
  fn[key] = (data, headers) => {
    return new Promise((resolve, reject) => {
      resolve(Fetch(Urls[key].url, {method: Urls[key].method, data, headers}));
    });
  };
});

export default fn;
