// pages/LAF/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['名称', '时间', '地点', '详情'],
    labelList: ['学生证', '身份证', '公交卡', '洗澡卡', '水杯', '雨伞', '手机', '钥匙','眼镜','大物','高数'],
    storyList:new Array(),
    indexList:new Array(),
    infoList:[],
    InfoList:[],
    daleteType:"",
    eye:"/pages/img/AD1B0CBA-D334-4B9A-A000-F82D33119671.png",
    isShowFastSearch:true,
    isshowhistory:null,
    index:'0',
    text:"",
    count:0,
    show:true,
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
  },
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
      wx.setStorageSync('infor', this.data.InfoList[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: 'detail',
      })
  },
  changeEye:function(){
    if (this.data.eye =="/pages/img/AD1B0CBA-D334-4B9A-A000-F82D33119671.png")    {
      this.setData({
        eye:"/pages/img/6FBB3393-7787-4FF9-9CC5-1FFD0C96482F.png",
        isShowFastSearch: false,
      })
    } else if (this.data.eye ="/pages/img/6FBB3393-7787-4FF9-9CC5-1FFD0C96482F.png"){
      this.setData({
        eye:"/pages/img/AD1B0CBA-D334-4B9A-A000-F82D33119671.png",
        isShowFastSearch: true
      })
    }
    wx.request({
      url: 'http://localhost:8080/search/eye',
      method: "PUT",
      header: app.globalData.header,
      data: {
        eye:this.data.eye,
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openid)
  },
  /**
   * 生命周期函数--监听页面显示
   * 获得用户历史搜索
   */
  onShow: function () {
    var that = this;
    wx,wx.request({
      url: 'http://localhost:8080/search/history/'+app.globalData.openid,
      header: app.globalData.header,
      method: 'GET',
      success: function(res) {
        console.log(res)
        /**
         * 是否查看推荐查询
         */
        that.setData({
          eye: res.data.eye,
        })
         /**
         * 若用户首次查询，则无历史记录，直接赋值会出错
         * storyList 用户历史记录字符串
         * indexList 用户历史记录类型
         */
        if(res.data != ''){
          if ((res.data.indexList != null && res.data.picker != "") || res.data == null) {
            console.log(res)
            that.setData({
              storyList: res.data.historyList,
              indexList: res.data.indexList,
              isshowhistory: true
            })
          }
        }else{
          /**
           * 无历史记录则显示提示
           */
          that.setData({
            isshowhistory:false
          })
        }
          if (that.data.eye == "/pages/img/AD1B0CBA-D334-4B9A-A000-F82D33119671.png") {
            that.setData({
              isShowFastSearch: true,
            })
          } else if (that.data.eye = "/pages/img/6FBB3393-7787-4FF9-9CC5-1FFD0C96482F.png") {
            that.setData({
              isShowFastSearch: false
            })
          }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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

  },
  /**
   * 选择搜索类型
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 删除历史搜索
   */
  deleteHistorySearch: function (res) {
    var that = this;
    console.log(res)
    if (res.type == 'tap') {
      /**
       * 全删
       */
      wx.showModal({
        title: '操作确认',
        content: '是否删除',
        success:function(e){
          if(e.confirm){
            wx.request({
              url: 'http://localhost:8080/search/detele/' + app.globalData.openid,
              method: "DELETE",
              header: app.globalData.header,
              success: function (res) {
                console.log(res)
                that.setData({
                  isshowhistory: false
                })
              }
            })
          }
        }
      })
      
    } else if (res.type == 'longpress') {
      /**
       * 删一条
       */
      var index = res.currentTarget.dataset.index
      if(index == this.data.storyList.length-1){
        this.updateHistory(index-1,2,this.data.storyList[index-1],this.data.indexList[index-1])
      }else {
        this.updateHistory(index, 2, this.data.storyList[index+1],this.data.indexList[index+1])
      }
    }
  },
  /**
   * 点击搜索获取用户搜索字符串
   */
  search2:function(res){
    console.log(res)
    if (res.detail.value.text==""){
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }else{
      this.data.text = res.detail.value.text;
      this.data.count = 0;
      this.data.infoList = new Array()
      this.updateHistory(0,0,res.detail.value.text,this.data.index)
    }
  },
  /**
   * 点击键盘搜索获取用户搜索字符串
   */
  search1: function (res) {
    if (res.detail.value == "") {
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    } else {
      this.data.text = res.detail.text;
      this.data.count = 0;
      this.data.infoList = new Array()
      this.updateHistory(0,0,res.detail.value,this.data.index)
    }
  },
  /**
   * 更新历史记录
   * a,b用来控制删除还是添加数据
   * b = 0为搜索添加，b=1为删除记录
   * text 查找数据
   * index 查找类型
   */
  updateHistory:function(a,b,text,index){
    var that = this
    /**
      * 头插,最多记录10条记录
      */
    this.data.storyList.splice(a,b,text)
    this.data.indexList.splice(a,b,index)
    console.log(this.data.storyList)
    if (this.data.storyList.length > 10) {
      this.data.storyList.splice(10, 1)
      this.data.indexList.splice(10, 1)
    }
    wx.request({
      url: 'http://localhost:8080/search/history',
      method: "PUT",
      header: app.globalData.header,
      data: {
        indexList: this.data.indexList,
        openid: app.globalData.openid,
        historyList: this.data.storyList
      },
      success: function (res) {
        console.log(res)
        if(res.data.historyList[0] !=  null){
          that.setData({
            indexList: res.data.indexList,
            storyList: res.data.historyList
          })
        }else{
          that.setData({
            indexList: new Array(),
            storyList: new Array(),
            isshowhistory:false,
          })
        }
        
      }
    })
    /**
     * 
     */
    if(b == 0){
      this.search(text,index)
    }
  },
  /**
   * 记录用户触发底部次数
   */
  addInformation:function(){

    this.data.count = this.data.count + 1
    this.search(this.data.text,this.data.index)
  },
  /**
   * 搜索方法
   * InfoList:记录未被格式化数据，用于进入detail显示
   * infoList用于在本界面显示
   * length记录infoList未连接新数据时长度
   */
  search: function (res,index) {
    var that = this
    wx.request({
     url: 'http://localhost:8080/search/'+index+'/'+res+'/'+that.data.count,
     method:'GET',
     header: app.globalData.header,
     success:function(res){
       console.log(res)
        if(res.statusCode == 200){
          if(res.data.length == 0 && that.data.count == 0){
            wx.showToast({
              title: '未找到该内容',
              icon: "none"
            })
          } else if (res.data.length == 0 && that.data.count != 0){
            wx.showToast({
              title: '到底了',
              icon: "none"
            })
          }else {
            that.setData({
              show: false,
            })
            var length = that.data.infoList.length
            that.data.InfoList = that.data.InfoList.concat(res.data),
            that.data.infoList = that.data.infoList.concat(res.data),
            that.infoCss(length);
            console.log(length)
          }
        }else if(res.statusCode==404){
          wx.showToast({
            title: '到底了',
            icon:'none',
            duration:1000,
          })
        }
     }
   })
  },
  infoCss: function (length) {
    for (var i = length; i < this.data.infoList.length; i++) {
      if (this.data.infoList[i].kind == "招领") {
        this.data.infoList[i].place = "拾取地点:" + this.data.infoList[i].place
        this.data.infoList[i].time = "拾取时间:" + this.data.infoList[i].time
      } else if (this.data.infoList[i].kind == "遗失") {
        this.data.infoList[i].place = "丢失地点:" + this.data.infoList[i].place
        this.data.infoList[i].time = "丢失时间:" + this.data.infoList[i].time
      }
    }
    this.setData({
      infoList: this.data.infoList
    })
  },
  /**
   * 推荐查询
   */
  fastSearch:function(res){
    console.log(res)
    this.data.text = this.data.labelList[res.currentTarget.dataset.index],
    this.search(this.data.labelList[res.currentTarget.dataset.index],this.data.indexList[this.data.index])
  },
  /**
   * 历史查询
   */
  historySearch:function(res){
    console.log(this.data.storyList[res.currentTarget.dataset.index])
    console.log(this.data.indexList[res.currentTarget.dataset.index])
    this.data.text = this.data.storyList[res.currentTarget.dataset.index],
    this.data.index = this.data.indexList[res.currentTarget.dataset.index]
    this.search(this.data.storyList[res.currentTarget.dataset.index], this.data.indexList[res.currentTarget.dataset.index])
  }
})