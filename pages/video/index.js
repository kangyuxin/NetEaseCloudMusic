// pages/video/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },

  async getVideoGroupList () {
    const videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupList.data.slice(0, 14),
      navId: videoGroupList.data[0].id
    })
    this.getVideoList(this.data.navId)
  },

  async getVideoList (navId) {
    const videoListData = await request('/video/group', {id: navId})

    wx.hideLoading({
      complete: (res) => {},
    })

    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false
    })
  },

  changeNav (event) {
    let navId = event.currentTarget.id
    this.setData({
      navId,
      videoList: []
    })

    wx.showLoading({
      title: '正在加载',
    })

    this.getVideoList(this.data.navId)
  },

  handlePlay (event) {
    let vid = event.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop()

    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  // 监听视频播放进度
  handleTimeUpdate (event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  handleEnded (event) {
    let {videoUpdateTime} = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },

  // 下拉刷新
  handleRefresh () {
    this.getVideoList(this.data.navId)
  },

  handleToLower () {
    // 分页
    console.log("发送请求")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})