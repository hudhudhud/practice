import { post } from "../httpRequest";


// 获得 课程列表
export function getAllCurriculumList() {
  if(!arguments[0].name){
    delete arguments[0].name;
  }
  return post("/course/list", arguments);
}
export function getAllCurriculumListLibrary() {
  if(!arguments[0].name){
    delete arguments[0].name;
  }
  return post("/courseLibrary/list", arguments);
}

// 获得 课程 介绍 详情
export function getCurriculumIntro() {
  return post("/course/detail", arguments);
}
// 获得 课程 介绍 详情
export function getCurriculumIntro2() {
  return post("/courseLibrary/detail", arguments);
}
// 根据课程 获取机构列表
export function listMechanismByCourse() {
  return post("/course/listMechanism", arguments);
}

// 收藏  课程
export function favoriteSave() {
  if(arguments[1].favoriteStatus){
    return post("/favorite/cancel", arguments);
  }else{
    return post("/favorite/save", arguments);
  }
}

// 收藏  列表
export function favoriteList() {
    return post("/favorite/list", arguments);
}


// 获得 该机构下 课程列表
export function getCurriculumList() {
  if(!arguments[0].id){
    delete arguments[0].id
  }
  return post("/course/list", arguments);
}

//获取 社区列表
export function getCommunityCollegeList() {
  return post("/nearby/listNearbyCommunity", arguments);
}
