const wafer = require('./vendors/wafer-client-sdk/index');
const config = require('./config.js');

//app.js
App({

  globalData: {
    userInfo: null,
    hasUserInfo: false,
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取登陆会话
    wafer.setLoginUrl(config.service.loginurl);
    wafer.request({
      login: true,
      url: config.service.userurl,
      method: 'GET',
      success: (res) => {
        if (+res.statusCode == 200) {
          if (res.data.openId) {
            this.globalData.userInfo = res.data
            this.globalData.hasUserInfo = true
            console.log('4.获取用户登录凭证APP：' + res.data.openId);
            console.log('5.获取用户信息成功：' + res.data.nickName);
          } else {
            this.globalData.userInfo = res.data
            console.log('会话获取失败', res.data);
          }
        } else {
          console.log('响应码：' + res.statusCode);
        }
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回  
        // 所以此处加入 callback 以防止这种情况  
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
          console.log('7.callback定义成功')
        } 
      },
      fail: (error) => {
        console.log('获取失败' + error.message);
      },

    })

    wx.getSystemInfo({
      success: function (res) {
        console.log('3.系统信息获取成功')
      }
      
    })
    console.log('6.当前的userInfo：' + this.globalData.userInfo + '，hasUserInfo:' + this.globalData.hasUserInfo )
  },

})




