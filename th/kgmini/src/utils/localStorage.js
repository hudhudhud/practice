export const getItem = function(key) {
  let data = "";
  try {
    data = wx.getStorageSync(key);
  } catch (e) {
    data = localStorage.getItem(key);
  }
  try {
    data = JSON.parse(data);
  } catch (e) {
  }

  return data;
};
export const setItem = function(key, value) {
  let data = value;
  if (typeof data === "object")
    data = JSON.stringify(data);
  try {
    wx.setStorageSync(key, data);
  }catch (e) {
    localStorage.setItem(key,data)
  }
};

export const clearItem = function(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    // Do something when catch error
  }
};
