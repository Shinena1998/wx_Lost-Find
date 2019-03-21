const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    decode:true,
    msg: [],
    savedFilePath:"/pages/img/addPic.png ",
    pictureCssPaths: ["/pages/img/199FA2CA-7177-4640-A2F3-B8F7C5FC117E.png",
      "/pages/img/27C36CF5-7208-4527-B3BA-70333A1B09CF.png",
      "/pages/img/87911B73-D05B-4A54-AFAF-BC667C6E4964.png",
      "/pages/img/3758617A-1DC9-46C4-B092-D49545B70020.png",
      "/pages/img/986803F3-6074-4624-8F2A-2FB638147B3E.png"],
    isUploadPic:false,
    //失物类型
    category:null,
    time:"2018-11-2",
    Time:"请输入时间 >",
    TimeColor:'rgb(148, 145, 145)',
    array: ['QQ', '微信', '电话','无'],
    picker: ['曲江', '金花', '莲湖'],
    index:0,
    picPath:"noImage",
    contactWay:"",
    contant:"",
    place:"",
    information:"",
    question:"",
    anwer:"",
    openId:"",
    theme:'',
    //照片长宽
    ImgHeight:0,
    ImgWidth:0,
    infoCss: { time: "丢失时间", place: "丢失地点" },
    aBoolean:false,
    showModal:false,
    kind:"遗失",
    loseBC:'white',
    borderL:'5rpx solid #fafafa;',
    findBC:"#e8e8e8",
    borderF:"",
    pageBackgroundColor:null,
    isValuable:false,
    formId:"",
    isCard:false,
    detailInfo:{},
    img:'',
    imgInfo:"",
    hasCardInfo:false,
    items_category:[
      { name: '证件', value: '证件', checked: false },
      { name: '学习', value: '学习', checked: false },
      { name: '电子', value: '电子', checked: false },
      { name: '生活', value: '生活', checked: false  },
    ],
    items_kind: [
      { name: '遗失', value: '遗失', checked: false },
      { name: '招领', value: '招领', checked: false },
    ],
    num:0,//校区选择
  },
  /**
   * 选择信息类型
   */
  selectKind:function(e){
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    if(id == 1){
      this.setData({
        loseBC: 'white',
        borderL: '5rpx solid #fafafa;',
        findBC: "#e8e8e8",
        borderF: "",
        kind:'遗失',
        infoCss: app.globalData.infoLostCss
      })
    }else if(id ==2 ){
      this.setData({
        loseBC: '#e8e8e8',
        borderL: '',
        findBC: "white",
        borderF: "5rpx solid #fafafa;",
        kind: '招领',
        infoCss: app.globalData.infoFindCss
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openId = app.globalData.openid;
    this.setData({
      time: app.time,
      Time: app.time
    })
    console.log(app.time)
  },
  toService:function(){
    wx.switchTab({
      url: 'service',
    })
  },
  toUser: function () {
    wx.switchTab({
      url: 'user',
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: 'index',
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    console.log(app.globalData.school)
    if (!app.globalData.school) {
      wx.showModal({
        title: '请补全信息',
        content: '点击首页图像右下侧',
        showCancel: false,
        success: function () {
          wx.switchTab({
            url: 'index',
          })
        }
      })
    }
  },
  onHide:function(){
  },
  onPullDownRefresh: function () {
  },
  /**
   * 设置重要事件
   */
  valuable: function (e) {
    if (e.detail.value){
      this.setData({
        isValuable:true
      });
    }else {
      this.setData({
        isValuable: false
      });
    }
    console.log(this.data.isValuable)
  },
  /**
   * 选择联系方式类型
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    if(this.data.index == 3){
      this.setData({
        contactWay: '3+失主自取',
        contact:"失主自取"
      })
    }else{
      this.setData({
        contact: ""
      })
    }
  },
  /**
   * 联系方式规则
   * content 输入字符串，qq正则表达式，wechat正则表达式,phone正则表达式
   */
  contentCss: function (res) {
    console.log(res.detail.value)
    // var qq = /^\d{8,10}$/
    // var phone = /^1\d{10}$/
    // var wechat = /^\w{1,}$/
    // var content = res.detail.value
    // if (this.data.index == 0 && (!qq.test(content)) ){
    //   wx.showToast({
    //     title: '请检查输入qq号',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    // } else if (this.data.index == 1 && (!wechat.test(content))) {
    //   wx.showToast({
    //     title: '请检查输入微信号',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    // }else if (this.data.index == 2 && (!phone.test(content)) ){
    //   wx.showToast({
    //     title: '请检查输入电话号码',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    // } else if (this.data.index == 3){
      
    // }else {
    //   this.data.contactWay = this.data.index+"+"+content;
    // }
    var content = res.detail.value
    var phone = /^1\d{10}$/
    if(content != "" && !phone.test(content)){
      wx.showToast({
        title: '请检查输入电话号码',
        icon: 'none',
        duration: 1000,
      })
    } else if (content != "" && phone.test(content)) {
      this.data.contactWay = "2+" + content;
    } else if (content == ""){
      this.data.contactWay = "3+失主自取";
    }
    console.log(this.data.contactWay)
  },
  /**
   * 选择时间
   */
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      Time: e.detail.value,
      TimeColor:null
    })
  },
  PickerChange(e) {
    console.log(e);
    var p = this.data.picker[e.detail.value];
    this.setData({
      num: e.detail.value,
      place: p
    })
    console.log(this.data.place)
  },
  /**
 * 获取失物类型
 * 改变默认图片
 */
  radioChangeCategory: function (e) {
    console.log(e);
    this.data.category = e.detail.value;
    var picture = this.data.pictureCssPaths
    if (!this.data.isUploadPic) {//防止已上传照片，更换类型变为默认图片
      if (e.detail.value == "证件") {
        this.setData({
          savedFilePath: picture[0],
          picPath: picture[0],
        })
      } else if (e.detail.value == "学习") {
        this.setData({
          savedFilePath: picture[1],
          picPath: picture[1],
        })
      } else if (e.detail.value == "电子") {
        this.setData({
          savedFilePath: picture[2],
          picPath: picture[2],
        })
      } else if (e.detail.value == "生活") {
        this.setData({
          savedFilePath: picture[3],
          picPath: picture[3],
        })
      }
    }
    //显示证件卡号
    if (e.detail.value == "证件") {
      this.setData({
        isCard: true
      })
    } else {
      this.setData({
        isCard: false
      })
    }
    //发布完消息后切换到相应类型
    if (e.detail.value == "证件") {
      app.globalData.category = '0'
    } else if (e.detail.value == "学习") {
      app.globalData.category = '1'
    } else if (e.detail.value == "电子") {
      app.globalData.category = '2'
    } else if (e.detail.value == "生活") {
      app.globalData.category = '3'
    }
  },
 /**
 *获取物品照片 
 */
  uploadImg: function () {
    if(this.data.category != null){
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: 'compressed',
        success: function (res) {
          console.log("a" + res)
          wx.showToast({
            title: '正在发送',
            icon: 'loading',
            duration: 2500,
          })
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
              /**
               * 图片长宽最大为999，要配合取值
               */
              that.data.ImgHeight = res.height
              that.data.ImgWidth = res.width
              console.log(res)
              that.writeInfo()
            }
          })
          that.setData({
            /**
             * 1.在视图界面显示上传图片
             * 2.记录上传图片的临时文件路径，以便后面上传至服务器
             */
            savedFilePath: res.tempFilePaths[0],
            isUploadPic: true
          })
        }
      })
    }else{
      wx.showToast({
        title: '请选择失物类型',
        icon:'none',
      })
    } 
  },
  /**
   * isUploadPic用于记录用户是否上传图片，
   */
  writeInfo: function () {
    var that = this;
    if (that.data.isUploadPic) {
      /**
      * 上传图片，最大10M
      */
      wx.uploadFile({
        url: app.globalData.domain + '/uploadImage',
        filePath: that.data.savedFilePath,
        name: 'file',
        formData: {
          height: that.data.ImgHeight,
          width: that.data.ImgWidth,
          category: that.data.category,
          openid: app.globalData.openid
        },
        method: "POST",
        header: app.globalData.header,
        success: function (res) {
          wx.showToast({
            title: '上传成功',
            duration: 1000,
          })
          console.log(res)
          if (res.statusCode == 200) {
            var info = JSON.parse(res.data)
            console.log(info.imgInfo)
            console.log(info.imgPath)
            that.setData({
              picPath: info.imgPath,
              imgInfo: info.imgInfo
            })
            var type = {
              "type": "idea", "data": info.imgInfo
            }
            if (that.data.category == "证件") {
              that.getCard(type);
            }
          }
          console.log("zxc" + that.data.isValuable)
        }, fail: function (res) {
          wx.showToast({
            title: '发布信息失败，请重试',
          })
        }
      })
    } else {
      that.uploadInfo()
    }
  },
  /**
   * 提交用户填写的失物数据
   */
  formSubmit: function (e) {
    this.data.formId = this.data.formId + e.detail.formId + '+'
    this.setData({
      formId: this.data.formId
    })
    var that = this;
    console.log(e.detail)
    var value = e.detail.value
    this.setData({
      information:value.info,
      theme:value.theme,
    })
    if(this.data.information == ""){
      this.data.information = "无"
    }
    /**
     * 证件卡号与物品详细信息用"+"连接，
     */
    if (this.data.category == '证件') {
      this.data.information = this.data.information +'+'+value.card
    }
    console.log(this.data.information)
    console.log(value.place+this.data.category)
    if (this.data.kind == "" || this.data.theme == "" || this.data.category == ""  || this.data.place == "" ){
      /**
       * 联系方式选择无会自动将联系方式填为失主自取，此时如果改变联系方式为qq或其他，
       * 则会直接通过，提交表单，故在此拦截这种不合理的提交方式
       */
      // if (this.data.contactWay == '3+失主自取' && this.data.index != 3){
      //   wx.showToast({
      //     title: "请检查联系方式",
      //     icon: "none",
      //   })
      // }else {
      //   wx.showToast({
      //     title: "请填全信息",
      //     icon: "none",
      //   })
      // }  
      wx.showToast({
        title: "请填全信息",
        icon: "none",
      })
      }else {
      this.uploadInfo()
      }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
  * 将所有信息写进数据库
  */
  uploadInfo:function(){
    console.log(app.globalData.userinfo)
    var that= this
    wx.request({
      url: app.globalData.domain +'/msg',
      method: "POST",
      header: app.globalData.header,
      data: {
        kind: that.data.kind,
        theme: that.data.theme,
        valuable: that.data.isValuable,
        category: that.data.category,
        time: that.data.Time,
        picPath: that.data.picPath,
        contactWay: that.data.contactWay,
        place: that.data.place,
        infomation: that.data.information,
        aBoolean: false,
        identity: that.data.openId,
        formId:that.data.formId,
        user: app.globalData.userinfo,
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 12) {
            console.log("asd" + that.data.openId)
            wx.showToast({
              title: "发布信息失败，请重试",
              icon: "none",
            })
          } else if (res.data.code == 0) {
            console.log(that.data.isValuable)
            if (that.data.isValuable){
              wx.showToast({
                title: '等待管理员审核',
                icon: 'success',
                duration: 1500,
                success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: 'index',
                    })
                  }, 1500)
                }
              })
            }else{
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                  setTimeout(function () {
                    //改变内存数据
                    res.data.data.commentMysqlList = []
                    app.globalData.info.push(res.data.data)
                    app.globalData.isChangeInfo = true;
                    wx.switchTab({
                      url: 'service',
                    })
                  }, 1000)
                }
              })
            }
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '发布信息失败，请重试',
        })
      }
    })   
  },
  //获取formId
  formSubmit1:function(res){
    console.log(res.detail.formId)
    this.data.formId = this.data.formId + res.detail.formId + '+'
    this.setData({
      formId:this.data.formId
    })
    console.log(this.data.formId)
  },
  /**
   * 获得证件卡号和已有进行对比数据库
   */
  getCard:function(res){
    var that = this
    var info = null
    if(res.type == "idea"){
      info=res.data
    }else{
      info=res.detail.value
    }
    console.log(res)
    wx.request({
      url: app.globalData.domain + '/Card',
      method: "GET",
      header: app.globalData.header,
      data:{
        card:info
      },
      success:function(res){
        console.log(res)
        if(res.data != "" && res.statusCode==200){
          if(res.data.aBoolean){
            that.setData({
              detailInfo: res.data,
              hasCardInfo: true,
              img: 'https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png'
            })
          }else{
            that.setData({
              detailInfo: res.data,
              hasCardInfo: true
            })
          }
        }
      }
    })
  },
  /**
   * 点击信息进入详细界面
   */
  toDetail: function () {
    wx.setStorageSync("infor", this.data.detailInfo)
    this.setData({
      detailInfo: {},
      hasCardInfo: false
    })
    wx.navigateTo({
      url: 'detail',
    })
  },
  /**
   * 点击其他区域关闭信息
   */
  closeInfo:function(){
    this.setData({
      detailInfo: {},
      hasCardInfo: false
    })
  }
})