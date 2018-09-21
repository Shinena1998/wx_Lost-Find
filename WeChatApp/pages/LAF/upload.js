const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    decode:true,
    msg: [],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
    category:"",
    time:"",
    picPath:"",
    contactWay:"",
    place:"",
    information:"",
    question:"",
    anwer:"",
    openId:"",
    aBoolean:false,
    showModal:false,
    items: [
      { name: '证件', value: '证件', checked: false },
      { name: '钱包', value: '钱包', checked: false },
      { name: '书本', value: '书本', checked: false  },
      { name: '其他', value: '其他', checked: false  },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openId = app.globalData.openid;
    /**
     * 因为app.globalData.checked为字符串，所以先要转化为int型,将对应种类checked
     * 赋值为true即可使对应按钮选中
     */
    console.log(parseInt(app.globalData.checked))
    this.data.items[parseInt(app.globalData.checked)].checked=true;
    this.setData({
      items : this.data.items
    })
  },

  onReady: function () {
  },
  onShow: function () {
  },
  onPullDownRefresh: function () {
  },
 /**
 *获取物品照片 
 */
  uploadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType:'compressed',
      success: function (res) {
        console.log("a"+res)
        that.setData({
          /**
           * 1.在视图界面显示上传图片
           * 2.记录上传图片的临时文件路径，以便后面上传至服务器
           */
          savedFilePath: res.tempFilePaths[0]
        })
      }
    })
  },
  /**
   * 提交用户填写的失物数据
   */
  formSubmit: function (e) {
    var that = this;
    console.log(e.detail)
    var value = e.detail.value
    this.setData({
      contactWay:value.contactWay,
      information:value.info,
      place:value.place,
      time:value.time
    })
    console.log(value.place+this.data.category)
    if (this.data.category == "" || this.data.information == "" 
      || this.data.time == "" || this.data.place == ""
      || this.data.contactWay == ""){
        wx.showToast({
              title: "填完内容",
              icon: "none",
            })
      }else {
        this.writeInfo();
      }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 获取失物类型
   */
  radioChange:function(e){
    console.log(e);
    this.data.category = e.detail.value;
  },
  /**
   * 发送物品信息到后端
   */
  writeInfo:function(){
    var that = this;
    var time = new Date();
    var current = time.toLocaleDateString() + time.toLocaleTimeString();
    /**
    * 上传图片，最大10M
    */
    wx.uploadFile({
      url: 'http://localhost:8081/uploadImage',
      filePath: that.data.savedFilePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {
        that.setData({
          picPath: res.data
        })
        /**
         * 将所有信息写进数据库
         */
        wx.request({
          url: 'http://127.0.0.1:8081/msg',
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            category: that.data.category,
            current: current,
            time: that.data.time,
            picPath: that.data.picPath,
            contactWay: that.data.contactWay,
            place: that.data.place,
            infomation: that.data.information,
            aBoolean: true,
            identity: that.data.openId
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              if (res.data.code == 12) {
                console.log("asd" + that.data.openId)
                wx.showToast({
                  title: "网络错误,获取用户表示失败",
                  icon: "none",
                })
              } else if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 5000,
                  success: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
   
  
  },

})