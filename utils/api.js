const app = getApp()
const baseUrl = app.globalData.baseUrl;

// loading配置，请求次数统计
function startLoading() {
  wx.showLoading({
    title: '加载中'
  })
}

function getToken() {
  let header
  if (wx.getStorageSync('token')) {
    header = {
      token: wx.getStorageSync('token'),
      refreshToken: wx.getStorageSync('refreshToken')
    }
  }
  return header;
}

function clearToken() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('refreshToken');
}

function endLoading() {
  wx.hideLoading();
}

// 声明一个对象用于存储请求个数
var needLoadingRequestCount = 0;

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// get/post请求
function fun(url, method, data) {
  data = data || {};
  // 设置请求头
  let header = getToken() || {};
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      header: header,
      data: data,
      method: method,
      success: function (res) {
        // 没有登录,或是登陆失效
        let code = res.data.code;
        if ([500205, 500202].indexOf(code) != -1) {
          clearToken();
          wx.showToast({
            title: '登陆失效，请退出小程序重新登陆',
            icon: 'none'
          })
          reject('登陆失效，请退出小程序重新登陆');
        } else if (code != 500000) {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
          if (code == 500200) {
            clearToken();
          }
          reject(res.data.msg);
        }
        resolve(res.data);
        tryHideFullScreenLoading();
      },
      fail: function (res) {
        // fail调用接口失败
        reject({
          error: '网络错误',
          code: 0
        });
        tryHideFullScreenLoading();
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}

// 上传
function upload(url, name, filePath) {
  let header = {};
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: baseUrl + url,
      filePath: filePath,
      name: name,
      header: header,
      success: function (res) {
        resolve(res);
        tryHideFullScreenLoading();
      },
      fail: function () {
        reject({
          error: '网络错误',
          code: 0
        });
        tryHideFullScreenLoading();
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  });
  return promise;
}

module.exports = {
  "get": function (url, data) {
    return fun(url, "GET", data);
  },
  "post": function (url, data) {
    return fun(url, "POST", data);
  },
  upload: function (url, name, filePath) {
    return upload(url, name, filePath);
  }
};