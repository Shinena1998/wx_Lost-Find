// //index.js
// //获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:null,
    image_show: false,
    showModal: false,
    showModal2:false,
    showIndex:true,
    suggestion:"",
    logoLeft: "/pages/img/logo.png",
    logoRight:"/pages/img/2014062374843457.png",
    remind:"申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之",
    userInfo:{},
    docode:true,
    hasUserInfo: false,
    encryptedData:"",
    openid:"",
    session_key:"",
    iv:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //评价
    evaluate:false,
    openEva: 'open',//评价图片转化
    uiList: ['N', 'N', 'N', 'N', 'N'],
    feelList: ['N', 'N', 'N', 'N', 'N'],
    useList: ['N', 'N', 'N', 'N', 'N'],
    loadList: ['N', 'N', 'N', 'N', 'N'],
    ui:' ',
    feel:' ',
    use:' ',
    load:'',
    level:['非常差','较差','一般','较好','非常好'],
    //补全信息
    status:'',
    PersonInfo:true,
    showInfo:false,
    depart:"",
    classes:'',
    num:'',
    name:'',
    phone:'',
    toIndex:'a',
    windowWidth:null,
    valuable:[],//贵重信息
    showValuable:true,//展示
    imgList:[],//显示贵重背景图片
  }, 
  //补全信息
  Write_userinfo:function(){
    if (this.data.showInfo) {
      this.setData({
        showInfo: false,
      })  
    } else {
      this.setData({
        showInfo: true,
      })
    }
  },
  depart: function (e) {
    if (e.detail.value != "") {
      this.data.depart = e.detail.value
    } else {
      wx.showToast({
        title: '院系不能为空',
        icon: 'none'
      })
    }
  },
  classes: function (e) {
    if (e.detail.value != "") {
      this.data.classes = e.detail.value
    } else {
      wx.showToast({
        title: '班级不能为空',
        icon: 'none'
      })
    }
  },
  num: function (e) {
    var num = /^\d{10}$/
    if (num.test(e.detail.value)){
      this.data.num = e.detail.value
    }else{
      wx.showToast({
        title: '请检查学号是否正确',
        icon:'none'
      })
    }
  },
  name: function (e) {
    if (e.detail.value != "") {
      this.data.name = e.detail.value
    } else {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
    }
  },
  phone: function (e) {
    var phone = /^1\d{10}$/
    if (phone.test(e.detail.value)) {
      this.data.phone = e.detail.value
    } else {
      wx.showToast({
        title: '请检查电话是否正确',
        icon: 'none'
      })
    }
  },
  submitInfo:function(){
    this.setData({
      depart: this.data.depart,
      classes: this.data.classes,
      num: this.data.num,
      phone: this.data.phone,
      name: this.data.name
    })
    var that = this
    setTimeout(function (){
      if (that.data.depart == "" || that.data.classes == "" ||
        that.data.num == "" || that.data.name == "" ||
        that.data.phone == "") {
        wx.showToast({
          title: '请填全信息',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.domain + '/writePersonInfo',
          method:'POST',
          header: app.globalData.header,
          data:{
            openid: app.globalData.openid,
            depart:that.data.depart,
            classes:that.data.classes,
            num:that.data.num,
            phone:that.data.phone,
            name:that.data.name
          },
          success:function(res){
            if(res.statusCode == 200){
              wx.showToast({
                title: '填写成功',
                success:function(){
                  that.Write_userinfo();
                }
              })
              app.globalData.school = true
            }
          }
        })
      }
    },100)
  },
  //评价
  openEva:function(){
    if (this.data.evaluate){
      this.setData({
        evaluate:false,
        openEva:'open'
      })
    }else{
      this.setData({
        evaluate: true,
        openEva: 'close'
      })
    }
  },
  ui:function(e){
    var index = null;
    if (e.currentTarget != null){
      this.submitEva(0, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else{
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.uiList[i] = 'H';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.uiList[i] = 'N';
    }
    this.setData({
      uiList: this.data.uiList,
      ui: this.data.level[index]
    }) 
  },
  feel: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(1, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.feelList[i] = 'H';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.feelList[i] = 'N';
    }
    this.setData({
      feelList: this.data.feelList,
      feel: this.data.level[index]
    })

  },
  use: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(2, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.useList[i] = 'H';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.useList[i] = 'N';
    }
    this.setData({
      useList: this.data.useList,
      use: this.data.level[index]
    })
  },
  load: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(3, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.loadList[i] = 'H';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.loadList[i] = 'N';
    }
    this.setData({
      loadList: this.data.loadList,
      load: this.data.level[index]
    })
  },
  submitEva:function(id,index){
    console.log(id + ""+index)
    wx.request({
      url: app.globalData.domain + '/writeEvaluate/' + id + '/' + app.globalData.openid+"/"+index,
      method: 'POST',
      header: app.globalData.header,
      success:function(res){
        console.log(res)
      }
    })
  },
  search: function (e) {
    wx.navigateTo({
      url: 'search',
    })
  },
  show_image:function(){
    this.setData({
      image_show:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: app.globalData.domain + '/getInfoView',
    //   method: 'GET',
    //   header: app.globalData.header,
    //   success:function(e){
    //     console.log(e)
    //   }
    // })
    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.data.windowWidth = res.windowWidth;
      }
    })
    var remindList = ["申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之","本平台只负责信息传递，失物的保管及完整性由当事人（拾物者）自行负责", "发布失物或寻物信息请注意您的个人信息泄漏，由此造成的手机骚扰等损失本平台不负任何责任", "当有失主已确认失物时，双方自行商讨归还失物，发布消息者及时结束消息", "信息的真实性由发布者自行负责，本平台不负任何责任","通过本平台发布的信息发生任何意外均与本平台无关"]
    var count = 0
    console.log('asd'+app.globalData.power)
    /**
     * 因为在开发者工具上是先执行app，然后在执行index
     * 但在手机上是并发执行，两个页面的请求互相竞争，所以有时就会token
     * 还没在app页面生成，这边发送相应请求。所以使用循环定时器没50毫秒验证一次是否
     * 对应数据是否改变
     * 之所以不用setTimeout是因为请求完毕和网速有关系，所以花费时间不确定，直接设置
     * 估计值有可能偏差太大，而循环定时器只会有小于等于50ms的延迟
     */
    var id = setInterval(function(){
      if (app.globalData.power != null && app.globalData.finish) {
        clearInterval(id)
        that.setData({
          showModal: !app.globalData.power,
        })
        //获得用户私人信息
        wx.request({
          url: app.globalData.domain + '/getPersonInfo',
          method: 'GET',
          header: app.globalData.header,
          data: {
            openid:app.globalData.openid,
          },
          success:function(res){
            console.log("personInfo")
            console.log(res)
            if(res.data != ''){
              that.setData({
                PersonInfo: false,
                depart: res.data.depart,
                classes: res.data.classes,
                num: res.data.num,
                phone: res.data.phone,
                name: res.data.name
              })
            } 
            //不用else if原因是确定权限等级，if顺序是为了保证显示当前用户最大身份
            if (app.globalData.power){
              that.setData({
                status: "普通用户"//仅授权
              })
              app.globalData.normal = true
            }
            if (res.data.openid != null) {
              that.setData({
                status: "校园用户"//填写校园信息
              })
              app.globalData.school = true;
            }
            if (app.globalData.isManager) {
              that.setData({
                status: "管理员"
              })
              app.globalData.school = true;
            }
            // else {
            //   that.setData({
            //     status: "游客"
            //   })
            //   app.globalData.customer = true
            // }
          }
        })
        wx.request({
          url: app.globalData.domain + '/getEvaluate',
          method: 'GET',
          header: app.globalData.header,
          data: {
            openid: app.globalData.openid,
          },
          success:function(res){
            console.log(res)
            if(res.data != ""){
              if(res.data.uiL > -1){
                that.ui(res.data.uiL);
              }
              if (res.data.useL > -1) {
                that.use(res.data.useL);
              }
              if (res.data.feelL > -1) {
                that.feel(res.data.feelL);
              }
              if (res.data.loadL > -1) {
                that.load(res.data.loadL);
              }
            }
          }
        })
        if (that.data.showValuable) {
          that.getValuable();
        }
        wx.request({
          url: app.globalData.domain + '/getPersonComment',
          method: 'GET',
          header: app.globalData.header,
          data: {
            openid: app.globalData.openid,
          },
          success: function (res) {
            console.log(res)
            app.globalData.comment = res.data;
            if (res.data.infoNum + res.data.replyNum > 0) {
              that.setData({
                notice: true,
              })
            } else {
              that.setData({
                notice: false,
              })
            }
          }
        })
      }
    },50) 
    setInterval(function () {
        count = (count + 1)%6
        that.setData({
          remind:remindList[count]
        })
      }, 2500)
    /**
    * 获取用户session_key,以及判断用户是否已经登录过
    */
    wx.getUserInfo({
      success: res => {
        console.log('授权用户')
        /**
         * 记录用户基本信息
         */
        app.globalData.userInfo = res.userInfo
        console.log(res)
        that.data.encryptedData = res.encryptedData
        that.data.iv = res.iv;

        //可以将 res 发送给后台解码出 unionId
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        app.globalData.userInfo = this.data.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var date = new Date();
    this.setData({
      date: date.toLocaleString(),
    })
    //测试mybatis分页
    // wx.request({
    //   url: app.globalData.domain + '/manager',
    //   method: 'GET',
    //   header: app.globalData.header,
    //   success:function(res){
    //     console.log("page")
    //     console.log(res)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    var util = require('../../utils/util.js')
    var that =this    
    setInterval(function () {
      that.setData({
        date: util.formatTime(new Date),
      })
    }, 1000) 
  },

  /**
   * 优化思路，在index界面获取物品信息，可以减少用户进入service界面是信息加载时间
   * index界面只获得所有重要物品以及一页普通物品数据，其他则继续在service界面获取
   * 从数据库获取信息只会在本页面和service翻页时进行，其他所有操作均直接操作app中的
   * info以及valuable，对内存直接操作，不在从新到数据库获取新数据。
   */
  getValuable: function () {
    var that = this
    /**
    * 获取重要信息
    */
    wx.request({
      url: app.globalData.domain + '/getValuable',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          that.data.valuable.unshift(res.data[i]);
        /**
         * 重要信息标志
         */
          that.data.imgList.push('https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png')
        }
        console.log(app.globalData.valuable)
        /**
        * 因为app.globalData.category是json包
        */

        if (res.data.length > 0){
          that.setData({
            valuable: that.data.valuable,
            imgList: that.data.imgList,
            showValuable:false,
          })
        }else{
          that.setData({
            showValuable:true
          })
        }
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
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
    console.log("下拉刷新")
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
   * 用户授权
   */
 getUserInfo: function (e) {
    var that = this
    that.data.encryptedData = e.detail.encryptedData;
    that.data.iv = e.detail.iv;
    /**
    * 判断用户是否为新用户
    */
   wx.request({
     url: app.globalData.domain +'/openid/' + app.globalData.openid,
     method: "GET",
     header: app.globalData.header,
     complete: function (res) {
       /**
        * 用户为新用户，则将用户写入数据库
        */
        console.log("新用户")
        console.log(res)
       if (res.data) {
         that.decodeEncryptedData()
       }
     }
   })
    app.globalData.normal = true
    console.log("普通用户")
    that.setData({
      status: "普通用户"
    })
    app.globalData.userInfo = e.detail.userInfo
    if(e.detail.userInfo != null){
      app.globalData.power = true;
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    app.globalData.userInfo = this.data.userInfo
    this.hideModal();
  },
  // /**
  //  * 进入查看界面
  //  */
  // toService: function (e) {
  //   e.currentTarget.id = 0;
  //   /**
  //    * 这里将json包赋值给app.globalData.category而不是e.currentTarget.id
  //    * 是为了配合service.js里面的category()函数的参数一致
  //    */
  //   app.globalData.category = e;
  //   wx.navigateTo({
  //     url: 'service',
  //   })
  // },
  // /**
  //  * 进入发布信息界面
  //  */
  // toUpload: function (e) {
  //   console.log(e.currentTarget.id);
  //   /**
  //    * 因为发布信息种类只是一个raido-group，所以我们只需要把数组对应位置记录就行了
  //    */
  //   app.globalData.checked = e.currentTarget.id;
  //   if(app.globalData.power){
  //     wx.navigateTo({
  //       url: 'upload',
  //     })
  //   }else {
  //     wx.showToast({
  //       title: '请授权',
  //       icon:"none"
  //     })
  //   }  
  // },
    /**
   * 
   * 对话框确认按钮点击事件
   * 获取用户详细信息
   * 将用户信息发送到后端
   */
  decodeEncryptedData:function(){
      var that = this;
      wx.request({
        url: app.globalData.domain +'/identity?encryptedData=' + that.data.encryptedData + '&session_key=' + app.globalData.session_key + '&iv=' + that.data.iv,
        header: app.globalData.header,
        method: 'GET',
        success: function (res) {
          console.log(res)
          wx.request({
            url: app.globalData.domain +'/user',
            method: "POST",
            header: app.globalData.header,
            data: {
              nickName: res.data.nickName,
              avatarUrl: res.data.avatarUrl,
              country: res.data.country,
              gender: res.data.gender,
              language: res.data.language,
              openId: res.data.openId,
              city: res.data.city,
              province: res.data.province
            },
            success: function (res) {
            }
          })
        }
      })
    },
  /**
   * 显示模态对话框
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  hideModal2: function () {
    this.setData({
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  onCancel2: function () {
    this.hideModal2();
  },
  /**
   * 接收用户建议
   */
  suggestion:function(res){
    console.log(res)
    this.data.suggestion = res.detail.value;
  },
  /**
   * 因为接收用户建议使用bindlur触发的时间，当用户点击完成确定此时使用bindtap触发发送信
   * 息事件，两事件处于竞争状态，不能确定两者先后次序，但这里需求是要先记录用户建议在发送
   * ，所以在发送信息事件用setTimeout延迟执行1s写入操作，保证先得到用户建议后写入后端
   */
  sendSuggestion:function(){
    this.setData({
      showModal2:false
    })
    var that = this
    setTimeout(function(){
      
    },1000)
  },
  toManager:function(){
    if (app.globalData.isManager){
      wx.navigateTo({
        url: 'manager',
      })
    }else{
      wx.switchTab({
        url: 'user',
      })
    }
  },
  Date:function (fmt) { //author: meizz   
    var o = {
      "M+": this.getMonth() + 1,                 //月份   
      "d+": this.getDate(),                    //日   
      "h+": this.getHours(),                   //小时   
      "m+": this.getMinutes(),                 //分   
      "s+": this.getSeconds(),                 //秒   
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
      "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  } 
})