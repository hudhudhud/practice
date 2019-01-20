const prod = 0;
const imageUrlDefault = prod ? "http://img-prod.keguanzhongxin.com/" : "http://img-test.keguanzhongxin.com/";
export const baseUrl = prod ? "https://api.keguanzhongxin.com/mobile" : "https://api.chinakeguan.cn/mobile";
export const imageUrl = prod ? "http://img-prod.keguanzhongxin.com/" : "http://img-test.keguanzhongxin.com/";
export const weekText = ["日", "一", "二", "三", "四", "五", "六"];
export const orderStatusText = ["", "committed", "paid", "cancelled", "evaluation"];
export const curriculumStatus = {
  committed: "待上课",
  stopped: "已停课",
  finished: "已上课"
};
export const curriculumType = ["", "社团课", "拓展课", "安心班"];
export const institutionNature = ["", "培训学校", "培训机构", "俱乐部", "个体工作室"];
//社会实践默认logo和门头图片
export const practiseDoorDefaultImg = imageUrlDefault+'practise-door-default.jpeg';
//机构门头默认图片
export const mechanismDoorDefaultImg = imageUrlDefault+'mechanism-door-default.jpeg';
//机构环境默认图片
export const mechanismEnvDefaultImg = imageUrlDefault+'mechanism-env-default.jpeg';
//机构logo默认图片
export const mechanismLogoDefaultImg = imageUrlDefault+'mechanism-logo-default.png';
