// pages/recommendSong/index.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendSongsList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo') 
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '../login/index',
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    // 获取每日推荐数据
    this.getRecommendSongsListData()
    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendSongsList, index} = this.data
      if (type == 'pre') {
        (index == 0) && (index = recommendSongsList.length)
        index -= 1
      } else {
        (index == recommendSongsList.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let musicId = recommendSongsList[index].id
      PubSub.publish('musicId', musicId)
    })
  },

  async getRecommendSongsListData () {
    let recommendSongsListData = await request('/recommend/songs')
    this.setData({
      recommendSongsList: recommendSongsListData.recommend
    })
  },

  toSongDetail (event) {
    let {song, index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/index?musicId=' + JSON.stringify(song.id),
    })
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