const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    decode:true,
    msg: [],
    pictureCssPaths:["/pages/img/199FA2CA-7177-4640-A2F3-B8F7C5FC117E.png ",
                    "/pages/img/27C36CF5-7208-4527-B3BA-70333A1B09CF.png ",
                    "/pages/img/87911B73-D05B-4A54-AFAF-BC667C6E4964.png",
                    "/pages/img/3758617A-1DC9-46C4-B092-D49545B70020.png",
                    "/pages/img/986803F3-6074-4624-8F2A-2FB638147B3E.png"],
    savedFilePath:"",
    isUploadPic:false,
    category:"",
    time:"",
    picPath:"",
    contactWay:"",
    place:"",
    information:"",
    question:"",
    anwer:"",
    openId:"",
    theme:'',
    infoCss: { time: "丢失时间", place: "丢失地点" },
    aBoolean:false,
    showModal:false,
    kind:"",
    isValuable:false,
    items_category:[
      { name: '证件', value: '证件', checked: false },
      { name: '钱包', value: '钱包', checked: false },
      { name: '书本', value: '书本', checked: false  },
      { name: '其他', value: '其他', checked: false  },
    ],
    items_kind: [
      { name: '遗失', value: '遗失', checked: false },
      { name: '招领', value: '招领', checked: false },
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
     * 上传界面也可能从service界面进入，所以要对app.globalData.checked进行判断是否为空
     */
    console.log(parseInt(app.globalData.checked))
    var count = parseInt(app.globalData.checked)
    if(app.globalData.checked != null){
      if(count < 4){
        this.data.items_category[count].checked = true;
        this.setData({
          items_category: this.data.items_category
        })
        this.data.category = this.data.items_category[count].value;  
      }
      /**
      * 物品为重要物品
      */
      else {
        console.log(count+"zxc")
        this.data.isValuable = true;
      }
    } 
    /**
     * 对应显示默认图片
     */
    this.setData({
      savedFilePath: this.data.pictureCssPaths[count],
      picPath: this.data.pictureCssPaths[count],
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
          savedFilePath: res.tempFilePaths[0],
          isUploadPic:true
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
      time:value.time,
      theme:value.theme
    })
    console.log(value.place+this.data.category)
    if (this.data.kind == "" || this.data.category == "" 
      || this.data.time == "" || this.data.place == ""
      || this.data.contactWay == ""){
        wx.showToast({
              title: "请填全信息",
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
   * 获取事件类型
   */
  radioChangeKind: function (e) {
    console.log(e);
    this.data.kind = e.detail.value;
    if (e.detail.value == "遗失"){
      this.setData({
        infoCss: app.globalData.infoLostCss
      })
    }else{
      this.setData({
        infoCss:app.globalData.infoFindCss
      })
    }
  },
  /**
   * 获取失物类型
   * 改变默认图片
   */
  radioChangeCategory:function(e){
    console.log(e);
    this.data.category = e.detail.value;
    var picture = this.data.pictureCssPaths
    var p = 0;
    for(var i = 0 ; i < picture.length;i ++){
      if(this.data.savedFilePath != picture[i]){
        p = p+1;
      }   
    }
    console.log(p)
    if(p < 5){
      if(e.detail.value == "证件"){
        this.setData({
          savedFilePath:picture[0],
          picPath:picture[0]
        })
      }else if (e.detail.value == "钱包") {
        this.setData({
          savedFilePath: picture[1],
          picPath: picture[1]
        })
      }else if (e.detail.value == "书本") {
        this.setData({
          savedFilePath: picture[2],
          picPath: picture[2]
        })
      }else if (e.detail.value == "其他") {
        this.setData({
          savedFilePath: picture[3],
          picPath: picture[3]
        })
      }
      
    }
  },
  /**
   * isUploadPic用于记录用户是否上传图片，
   */
  writeInfo:function(){
    var that = this;
    if(that.data.isUploadPic){
      /**
      * 上传图片，最大10M
      */
      wx.uploadFile({
        url: 'http://localhost:8080/uploadImage',
        filePath: that.data.savedFilePath,
        name: 'file',
        header: app.globalData.header,
        success: function (res) {
          console.log("iop" + res.data)
          that.setData({
            picPath: res.data
          })
          that.uploadInfo()
          console.log("zxc" + that.data.isValuable)
        }, fail: function (res) {
          wx.showToast({
            title: '发布信息失败，请重试',
          })
        }
      })
    }else {
      that.uploadInfo()
    }
    
  },
  /**
  * 将所有信息写进数据库
  */
  uploadInfo:function(){
    console.log()
    var that= this
    wx.request({
      url: 'http://localhost:8080/msg',
      method: "POST",
      header: app.globalData.header,
      data: {
        kind: that.data.kind,
        theme: that.data.theme,
        valuable: that.data.isValuable,
        category: that.data.category,
        time: that.data.time,
        picPath: that.data.picPath,
        contactWay: that.data.contactWay,
        place: that.data.place,
        infomation: that.data.information,
        aBoolean: false,
        identity: that.data.openId,
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
              title: '发布成功',
              icon:'success',
              duration:1000,
              success: function () {
                setTimeout(function(){
                  wx.navigateBack({
                  delta: 1
                })
                },1000)
              }
            })
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '发布信息失败，请重试',
        })
      }
    })   
  }
})