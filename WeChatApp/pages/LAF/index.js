// //index.js
// //获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stop:0,
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 15,
    interval: 20, // 时间间隔
    notice:false,
    indexView:false,
    endload:true,
    date:null,
    image_show: false,
    showModal: false,
    showModal2:false,
    showIndex:true,
    suggestion:"",
    logoLeft: "/pages/img/logo.png",
    logoRight:"/pages/img/2014062374843457.png",
    remind:"申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之    本平台只负责信息传递，失物的保管及完整性由当事人（拾物者）自行负责     发布失物或寻物信息请注意您的个人信息泄漏，由此造成的手机骚扰等损失本平台不负任何责任    当有失主已确认失物时，双方自行商讨归还失物，发布消息者及时结束消息    信息的真实性由发布者自行负责，本平台不负任何责任     通过本平台发布的信息发生任何意外均与本平台无关",
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
    openEva: 'icon-right',//评价图片转化
    uiList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    feelList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    useList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    loadList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
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
    wx.navigateTo({
      url: 'showInfo',
    })
    wx.setStorageSync("index", 11)
  },
  //评价
  openEva:function(){
    if (this.data.evaluate){
      this.setData({
        evaluate:false,
        openEva:'icon-right'
      })
    }else{
      this.setData({
        evaluate: true,
        openEva: 'icon-unfold'
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
      this.data.uiList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.uiList[i] = 'icon--star';
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
      this.data.feelList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.feelList[i] = 'icon--star';
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
      this.data.useList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.useList[i] = 'icon--star';
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
      this.data.loadList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.loadList[i] = 'icon--star';
    }
    this.setData({
      loadList: this.data.loadList,
      load: this.data.level[index]
    })
  },
  submitEva:function(id,index){
    console.log(id + "" + app.globalData.openid+" "+index)
    wx.request({
      url: app.globalData.domain + '/writeEvaluate/' + id + '/' + app.globalData.userinfo.num+"/"+index,
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
    wx.hideTabBar()
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
    var ids = 0;
    var id = setInterval(function(){
      if (app.globalData.userinfo != null && app.globalData.finish) {
        clearInterval(id)
        clearInterval(ids)
        that.getPersonComment();
        that.getEvaluate();
        that.getPersonInfo();
        that.getInformCount();
        that.setData({
          userInfo: app.globalData.userinfo,
          hasUserInfo: true
        })
      }
    },50) 
    setTimeout(function(){
        ids = setInterval(function () {
        if (app.globalData.power == false && app.globalData.finish) {
          clearInterval(ids)
          that.showModal()
          that.setData({
            endload: false
          })
        }
      }, 50)
      wx.showTabBar()
      that.setData({
        endload: false,
        indexView:true
      })
    },2000)
    // setInterval(function () {
    //     count = (count + 1)%6
    //     that.setData({
    //       remind:remindList[count]
    //     })
    //   }, 2500)
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
      that.data.stop = interval;
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  getInformCount:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getSystemCount',
      method: 'GET',
      header: app.globalData.header,
      data: {
        id:app.globalData.userinfo.num,
        reported: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data)
        app.globalData.informCount = res.data;
        if (res.data > 0) {
          that.setData({
            notice: true,
          })
        } 
      }
    })
  },
  getPersonComment:function(){
    var that = this
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
        } 
      }
    })
  },
  getEvaluate:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getEvaluate',
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid: app.globalData.userinfo.num,
      },
      success: function (res) {
        console.log(res)
        if (res.data != "") {
          if (res.data.uiL > -1) {
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
  },
  //获得用户私人信息
  getPersonInfo:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPersonInfo',
      method: 'GET',
      header: app.globalData.header,
      data: {
        id: app.globalData.userinfo.num,
      },
      success: function (res) {
        console.log("personInfo")
        console.log(res)
        if (res.data.name != null) {
          that.setData({
            PersonInfo: false,
            depart: res.data.depart,
            classes: res.data.classes,
            num: res.data.num,
            phone: res.data.phone,
            name: res.data.name
          })
          app.globalData.name = res.data.name
          that.getPushContent()
        }
        that.getLevel(res.data.user.name)
        // else {
        //   that.setData({
        //     status: "游客"
        //   })
        //   app.globalData.customer = true
        // }
      }
    })
  },
  getPushContent:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPushCount',
      method: 'GET',
      header: app.globalData.header,
      data:{
        name:app.globalData.name,
        look:false
      },
      success: function (res) {
        console.log("推送信息")
        console.log(res)
        if (res.data > 0) {
          app.globalData.pushCount = res.data
          that.setData({
            notice: true,
          })
        } 
      }
    })
  },
  getLevel:function(openid){
    var that = this
    //不用else if原因是确定权限等级，if顺序是为了保证显示当前用户最大身份
    if (app.globalData.power) {
      that.setData({
        status: "普通用户"//仅授权
      })
      
      app.globalData.normal = true
    }
    if (openid != null) {
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
    app.globalData.status = that.data.status;
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
    if (app.globalData.school) {
      that.setData({
        status: "校园用户",//填写校园信息,
        PersonInfo: false,
      })
    }
    if (app.globalData.isManager) {
      that.setData({
        status: "管理员"
      })
    }
    var length = that.data.remind.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  /**
   * 优化思路，在index界面获取物品信息，可以减少用户进入service界面是信息加载时间
   * index界面只获得所有重要物品以及一页普通物品数据，其他则继续在service界面获取
   * 从数据库获取信息只会在本页面和service翻页时进行，其他所有操作均直接操作app中的
   * info以及valuable，对内存直接操作，不在从新到数据库获取新数据。
   */
  onHide: function () {
    app.globalData.notice = this.data.notice
    console.log("index隐藏")
    console.log(this.data.stop)
    //防止页面被隐藏后，还在循环，切换回来造成卡顿，所以隐藏停止轮询
    clearInterval(this.data.stop);
    // this.scrolltxt();
  },
  toThanks:function(){
    wx.navigateTo({
      url: 'thanks',
    })
  },
  toNews: function () {
    wx.navigateTo({
      url: 'news',
    })
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
    if(e.detail.rawData != null){
      that.data.encryptedData = e.detail.encryptedData;
      that.data.iv = e.detail.iv;
      that.decodeEncryptedData();
      app.globalData.normal = true
      console.log("普通用户")
      that.setData({
        status: "普通用户"
      })
      if (e.detail.userInfo != null) {
        app.globalData.power = true;
      }
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    this.hideModal()
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
              app.globalData.userinfo = res.data.data
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
  hideModal2: function () {
    this.setData({
      showModal2: false
    });
  },
  showModal(e) {
    this.setData({
      modalName: "login"
    })
  },
  hideModal:function(e) {
    console.log(e)
    this.setData({
      modalName:"asda"
    })
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
})