
import audioList from './data.js'
const util = require('../../utils/util.js')


Page({
  data: {
    listShow: true,
    audioList: audioList,
    audioIndex: 0,
    pauseStatus: true,
    timer: '',
    currentPosition: 0,
    currentPositionm: 0,
    duration: 0,  
  }, 
  onLoad: function () {
    //  获取本地存储的audioIndex，currentPosition，duration
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    var currentPositionStorage = wx.getStorageSync('currentPosition')
    var durationStorage = wx.getStorageSync('duration')
    //  如果有本地播放记录，则进行数据初始化
    if (audioIndexStorage) {
      this.setData({ 
        audioIndex: audioIndexStorage, 
        listShow: false, 
        currentPosition: util.stotime(currentPositionStorage), 
        currentPositionm: currentPositionStorage,
        duration: util.stotime(durationStorage),
        sliderValue: Math.floor(currentPositionStorage * 100 / durationStorage),
        })
      //调用初始化上次播放的进度方法
      this.initplaystat()
      console.log(('初始化成功，进度位置：'+ this.data.currentPositionm +'秒'))
    }
    //注册监听事件
    this.onAudioState();
  },
  onReady: function (e) {
    console.log(this.data)
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    //this.audioCtx = wx.createAudioContext('audio')
    //console.log(this.audioCtx)

  },

  //定义方法：初始化上次播放进度
  initplaystat : function() {
    this.play()
    console.log('1.0 先开始')
    wx.seekBackgroundAudio({
      position: this.data.currentPositionm,
    })
    console.log('1.1 设置进度，' + this.data.currentPositionm)
    wx.pauseBackgroundAudio()
    console.log('1.2 再暂停，' + this.data.currentPositionm)
  },

  //定义绑定事件：用户调整播放进度
  bindSliderchange: function (e) {
    //把timer清除，避免冲突数据
    clearInterval(this.data.timer)
    //把页面中的value获取到
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        let { status, duration } = res
        console.log(res)
        if (status === 1 ) {
          that.setData({
            sliderValue: value,
            currentPositionm : Math.floor(value * duration / 100)
          })
          wx.seekBackgroundAudio({
            position: that.data.currentPositionm,
          })
        } else if (status === 0 ) {
          that.setData({
            sliderValue: value,
            currentPositionm: Math.floor(value * duration / 100)
          })
          that.initplaystat()
        }
        console.log(that.data)
      }
    })
  },
  //定义绑定事件：调整至前一首歌
  bindTapPrev: function () {
    console.log('bindTapPrev')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === 0) {
      audioIndexNow = length - 1
    } else {
      audioIndexNow = audioIndexPrev - 1
    }
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },

  //定义绑定事件：调整至下一首歌
  bindTapNext: function () {
    console.log('bindTapNext')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === length - 1) {
      audioIndexNow = 0
    } else {
      audioIndexNow = audioIndexPrev + 1
    }
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  //查看列表
  bindTapList: function (e) {
    console.log('bindTapList')
    console.log(e)
    this.setData({
      listShow: true
    })
  },
  //列表选择事件
  bindTapChoose: function (e) {
    console.log('bindTapChoose')
    console.log(this.data.audioIndex !== parseInt(e.currentTarget.id, 10))
    //定位选中的音乐序号，进入播放界面
    this.setData({
      listShow: false
    })
    if (this.data.audioIndex !== parseInt(e.currentTarget.id, 10)){
      clearInterval(this.data.timer) 
      console.log('清除') 
      this.setData({
        audioIndex: parseInt(e.currentTarget.id, 10),
        currentPositionm: 0,
      }) 
      this.initplaystat() 
    }
    let that = this
    console.log(that.data)
    //如果不是暂停状态，就播放
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    //把选择的序号存在本地，下次进入时直接调用
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10));
  },
  //播放按钮事件
  bindTapPlay: function () {
    console.log(this)
    console.log('bindTapPlay')
    console.log(this.data)
    if (this.data.pauseStatus === true) {
      this.play()
      this.setData({ pauseStatus: false })
      console.log(this.data)
    } else {
      wx.pauseBackgroundAudio()
      this.setData({ pauseStatus: true })
    }
  },
  //播放事件
  play() {
    let { audioList, audioIndex } = this.data
    console.log(this.data)
    wx.playBackgroundAudio({
      dataUrl: audioList[audioIndex].src,
      title: audioList[audioIndex].name,
      coverImgUrl: audioList[audioIndex].poster,
    })
    let that = this
    let timer = setInterval(function () {
      that.setDuration(that)
    }, 1000)
    this.setData({ timer: timer })
  },
  //获取音乐播放状态（当前进度信息）
  setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        let { status, duration, currentPosition } = res
        if (status === 1 || status === 0) {
          that.setData({
            currentPosition: util.stotime(currentPosition),
            duration: util.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
          wx.setStorageSync('currentPosition', currentPosition)
          wx.setStorageSync('duration', duration)
        } 
      }
    })
  },
  onAudioState: function () {
    let that = this
    wx.onBackgroundAudioStop(function () {
      // 当 音乐自行播放结束时触发
      console.log("on stop");
      let length = that.data.audioList.length
      let audioIndexNow = that.data.audioIndex
      if (audioIndexNow !== length - 1) {
        that.bindTapNext();
      } else {
        console.log("返回首页");
        that.setData({
          listShow: true,
          audioList: audioList,
          audioIndex: 0,
          pauseStatus: true,
          timer: '',
          currentPosition: 0,
          currentPositionm: 0,
          duration: 0,
        })
        console.log(that.data);
        wx.clearStorageSync();
      }
    });
  },
  
  onShareAppMessage: function () {
    let that = this
    return {
      title: 'light轻音乐：' + that.data.audioList[that.data.audioIndex].name,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  },

})