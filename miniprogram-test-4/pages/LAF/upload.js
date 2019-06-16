const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    write:false,
    fullname:"无",
    fullname2:"",
    showName:false,
    decode:true,
    msg: [],
    filePath:'',
    savedFilePath:"/pages/img/addPic.png",
    pictureCssPaths: ["/pages/img/199FA2CA-7177-4640-A2F3-B8F7C5FC117E.png",
      "/pages/img/27C36CF5-7208-4527-B3BA-70333A1B09CF.png",
      "/pages/img/87911B73-D05B-4A54-AFAF-BC667C6E4964.png",
      "/pages/img/3758617A-1DC9-46C4-B092-D49545B70020.png",
      "/pages/img/986803F3-6074-4624-8F2A-2FB638147B3E.png"],
    isUploadPic:false,
    //失物类型
    category:"",
    time:"2018-11-2",
    Time:"请输入时间 >",
    TimeColor:'rgb(148, 145, 145)',
    array: ['电话', '微信', 'QQ','无'],
    picker: ['曲江', '金花', '莲湖','校区外'],
    index:0,
    picPath:"noImage",
    contactWay: "",
    //contact为联系内容，contactWay为方式+内容
    contact:"",
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
    kind:"",
    loseBC:'#e8e8e8',
    borderL:'',
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
    count:0,
    cardId:"null",
  },
  /**
   * 选择信息类型
   */
  selectKind:function(e){
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    var that = this
    if(id == 1){
      this.setData({
        loseBC: 'white',
        borderL: '5rpx solid #fafafa;',
        findBC: "#e8e8e8",
        borderF: "",
        kind:'遗失',
        infoCss: app.globalData.infoLostCss,
        showName:false,
        fullname:"无"
      })
    }else if(id ==2 ){
      this.setData({
        loseBC: '#e8e8e8',
        borderL: '',
        findBC: "white",
        borderF: "5rpx solid #fafafa;",
        kind: '招领',
        infoCss: app.globalData.infoFindCss,
        showName:true,
        fullname:that.data.fullname2
      })
    }
  },
  //一卡通一键
  acard:function(){
    this.data.category = "证件";
    //格式为一卡通，则返回一卡通格式内容
    var that = this
    setTimeout(function () {
      that.uploadImg('一卡通')
    },500)
    //构造一个选择证件类型的数据结构
    var e = {'detail':{'value':"证件"}}
    //调用点击函数
    this.radioChangeCategory(e)
    this.data.items_category[0].checked = true
    this.setData({
      title:'一卡通',
      items_category:this.data.items_category
    })
  },
  //获得经纬度
  getLocation:function(){
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log("res.latitude" + res.latitude)
        console.log("res.longitude" + res.longitude)
        var latitude = res.latitude
        var longitude = res.longitude
        //itude经纬度 东南西北，因定位不准，给为求距离
        // var location = 
        // [{location:"曲江",itude:[109.00699,34.22492,108.99400,34.23068]},
        // { location:"金花", itude:[109.03488,34.25712,108.99630,34.26237]},
        // { location: "莲湖", itude:[108.91911,34.27551,108.91739,34.27884]}];
        var location =
          [{ location: "曲江", itude: [109.000495, 34.2278]},
          {location: "金花", itude: [109.01559, 34.259745]},
          { location: "莲湖", itude: [108.91825, 34.277175]}];
        var distance = 100000;
        var school = "校区外";
        var index = 3;
        for (var i = 0; i < 3; i++) {
          let d = Math.abs(longitude - location[i].itude[0]) + Math.abs(latitude - location[i].itude[1])
          console.log(distance+" "+d)
          if(distance > d){
            distance = d;
            index = i;
            school = location[i].location;
          }
        }
        // for(var i = 0 ; i < 3 ; i ++){
        //   if (location[i].itude[0] >= res.longitude && location[i].itude[2] <= res.longitude && location[i].itude[1] <= res.latitude && location[i].itude[3] >= res.latitude){
        //     school = location[i].location;
        //     index = i;
        //     break;
        //   }
        // }
        that.setData({
          num: index+'',
          place: school
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getLocation();
    if(options.type == "acard"){
      this.acard();
    }
    this.data.openId = app.globalData.openid;
    var util = require('../../utils/util.js')
    var date = util.formatTime(new Date).split(" ")[0].split("/").join("-")
    this.setData({
      time: date,
      Time: date
    })

    console.log(app.globalData.personinfo)
    this.setData({
      contactWay:"0+"+app.globalData.personinfo.phone,
      contact: app.globalData.personinfo.phone
    })
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
        contact:"失主自取",
        write:true
      })
    }else{
      this.setData({
        contact: "",
        write:false
      })
    }
  },
  /**
   * 联系方式规则
   * content 输入字符串，qq正则表达式，wechat正则表达式,phone正则表达式
   */
  contentCss: function (res) {
    console.log(res.detail.value)
    var qq = /^\d{8,10}$/
    var phone = /^1\d{10}$/
    var wechat = /^\w{1,}$/
    var content = res.detail.value
    if (this.data.index == 2 && (!qq.test(content)) ){
      wx.showToast({
        title: '请检查输入qq号',
        icon: 'none',
        duration: 1000,
      })
    } else if (this.data.index == 1 && (!wechat.test(content))) {
      wx.showToast({
        title: '请检查输入微信号',
        icon: 'none',
        duration: 1000,
      })
    }else if (this.data.index == 0 && (!phone.test(content)) ){
      wx.showToast({
        title: '请检查输入电话号码',
        icon: 'none',
        duration: 1000,
      })
    } else if (this.data.index == 3){
      
    }else {
      this.data.contactWay = this.data.index+"+"+content;
      this.data.contact = content;
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
 * type 是否为一卡通
 * 获取物品照片 
 */
  uploadImg: function (type) {
    console.log("进入了照片选择")
    var cameraType = []
    //一卡通直接相册选择，其他拍照或者相册
    if(type == '一卡通'){
      cameraType = ['album']
    } else {
      cameraType = ['album', 'camera']
    }
    if(this.data.category != null){
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: cameraType,
        success: function (res) {
          console.log("a" + res)
          wx.showLoading({
            title: '正在发送',
            mask: true,
          })
          that.data.isUploadPic = true;
          that.data.filePath = res.tempFilePaths[0]
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
              /**
               * 图片长宽最大为999，要配合取值
               */
              that.data.ImgHeight = res.height
              that.data.ImgWidth = res.width
              console.log(res)
              that.writeInfo(type)
              
            }, fail: function (e) {
              console.log(e)
            }
          })
          console.log(res.tempFilePaths[0])
        },fail:function(e){
          console.log(e)
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
   * 传参type属于write的参数，所以不能在wx.uploadFile总有，因为此时this指向
   * 已经改变
   */
  writeInfo: function (type) {
    var type1 = type
    console.log("type:"+type)
    var that = this;
    if (that.data.isUploadPic) {
      /**
      * 上传图片，最大10M
      */
      if(type != '一卡通'){
        type = that.data.category
      }
      wx.uploadFile({
        url: app.globalData.domain + '/uploadImage',
        filePath: that.data.filePath,
        name: 'file',
        formData: {
          height: that.data.ImgHeight,
          width: that.data.ImgWidth,
          category: type,
          openid: app.globalData.openid
        },
        method: "POST",
        header: app.globalData.header,
        success: function (res) {

          console.log("type" + type1)
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            duration: 1000,
          })
          console.log(res)
          if (res.statusCode == 200) {
            var info = JSON.parse(res.data)
            console.log(info.imgInfo)
            console.log(info.imgPath)
            var infoList = info.imgInfo.split('+')
            if (type1 != '一卡通'){ //不是一卡通模式
              console.log("非一卡通")
              if (infoList[0] != "noname") {
                that.setData({
                  fullname: infoList[0],
                  fullname2: infoList[0]
                })
              }
              if (infoList[1] != "nonumber") {
                that.setData({
                  imgInfo: infoList[1]
                })
              }
              if (infoList[2] != "unknownType") {
                that.setData({
                  title: infoList[2]
                })
              }
            }else{ //一卡通模式
              console.log("一卡通")
              that.setData({
                detail:infoList[0],
                imgInfo:infoList[1],
                fullname: infoList[2],
                fullname2: infoList[2]
              })
            }
            that.setData({/**
             * 1.在视图界面显示上传图片
             * 2.因为background-image只支持base64和http
             */
              savedFilePath: info.imgPath,
              picPath: info.imgPath,
            })

            var type = {
              "type": "idea", "data": that.data.imgInfo
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
    wx.showLoading({
      title: '正在提交',
      mask: true,
    })
    this.data.formId = e.detail.formId
    var that = this;
    console.log(e.detail)
    var value = e.detail.value
    if (value.info == "") {
      value.info = "无"
    }
    this.data.information = value.info
    this.data.theme=value.theme
    if(this.data.showName){
      if(value.fullname != ""){
        this.data.fullname = value.fullname
      }else{
        this.data.fullname = "无"
      }
    }
    
    /**
     * 证件卡号与物品详细信息用"+"连接，
     */
    console.log(this.data.information)
    console.log(value.place+this.data.category)
    if (this.data.kind == ""){
      wx.showToast({
        title: "请选择顶部失物招领启示",
        icon: "none",
      })
    } else if (this.data.theme == "" ){
      wx.showToast({
        title: "请填写物品名称",
        icon: "none",
      })
    } else if (this.data.category == "") {
      wx.showToast({
        title: "请选择失物种类",
        icon: "none",
      })
    } else if (this.data.place == "") {
      wx.showToast({
        title: "请填写校区",
        icon: "none",
      })
    } else if (this.data.contact == "") {
      wx.showToast({
        title: "请填写联系方式",
        icon: "none",
      })
    } else {
      this.uploadInfo()
    }
    // if (this.data.kind == "" || this.data.theme == "" || this.data.category == ""  || this.data.place == "" || this.data.contact == ""){
    //   /**
    //    * 联系方式选择无会自动将联系方式填为失主自取，此时如果改变联系方式为qq或其他，
    //    * 则会直接通过，提交表单，故在此拦截这种不合理的提交方式
    //    */
    //   // if (this.data.contactWay == '3+失主自取' && this.data.index != 3){
    //   //   wx.showToast({
    //   //     title: "请检查联系方式",
    //   //     icon: "none",
    //   //   })
    //   // }else {
    //   //   wx.showToast({
    //   //     title: "请填全信息",
    //   //     icon: "none",
    //   //   })
    //   // }  
    //   wx.showToast({
    //     title: "请填全信息",
    //     icon: "none",
    //   })
    //   }else {
    //   this.uploadInfo()
    //   }
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
      url: app.globalData.domain +'/msg/'+this.data.fullname,
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
        cardId:that.data.cardId,
        isConfirm:false,
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
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
                    app.globalData.isChangeInfo = true;
                    wx.navigateBack({
                      delta: 1,
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
                    // if (app.globalData.info.length > 0){
                    //   res.data.data.commentMysqlList = []
                    //   app.globalData.info.push(res.data.data)
                    // }
                    app.globalData.isChangeInfo = true;
                    wx.navigateBack({
                      delta:1,
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
    this.data.count = this.data.count+1;
    if (this.data.count < 5){
      this.data.formId = this.data.formId + res.detail.formId + '+'
    }else{
      this.data.formId = res.detail.formId + '+';
      this.data.count = 1
    }
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
      this.data.cardId = res.data
    }else{
      info = res.detail.value
      this.data.cardId = res.detail.value
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
  },
  returnS:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})