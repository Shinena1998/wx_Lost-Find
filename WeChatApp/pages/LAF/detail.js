const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailInfo:{},
    message:"",
    access_token:'',
    formId:'',
    nickName:'',
    infoCss:{},
    confirm:null,
    isshow:true,
    showModal:false,
    imgHeight:0,
    imgWidth:0,
    contact:"",
    contactWay:"",
    backType:true,
    contactList: ['/pages/img/QQ.png ',
                  '/pages/img/WeChat.png',
                  '/pages/img/number.png',
                  '/pages/img/no.png'],
    isHasFind:'未找到失主',
    //评论
    commentNum:0,
    comment:[],//评论json
    heightWindow:null,//屏幕高度
    deleteUp:null,//删除菜单动画变量
    reportUp:null,//举报菜单动画
    upingMenu:'',//标记选择菜单
    showMenu:false,//打开菜单是控制以外区域变量
    operating:null,//标记正在操作评论
    inputUp:false,//回复消息是让输入框获得焦点
    input_bottom:'8%',//控制出键盘时输入框的位置
    inputInit:'',//初始化输入内容
    placeHolder:"大胆提问吧",//将回复人显示为提示词
    toUid:"noUid",//回复人openid
    toName:'noName',//回复人姓名
    showTabar:true,//显示已完成或者过期信息不显示评论以及下边菜单
    windowWidth:0,//屏幕宽度
  },
  /**
   * 返回
   */
  back:function(){
    if(this.data.backType){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.redirectTo({
        url: 'index',
      })
    }
  },
  /**
   * 自动显示对应样式
   */
  onLoad: function (options) {
    console.log("asd")
    if(options.data!=null){
      console.log(options.data)
        this.data.detailInfo = JSON.parse(options.data),
        this.data.backType = false
    }else{
      console.log(wx.getStorageSync("infor"))
      this.data.detailInfo = wx.getStorageSync("infor"),
      wx.removeStorageSync("infor")
      //显示已完成或者过期信息不显示评论以及下边菜单
      if (this.data.detailInfo.timeOut != null){
        this.setData({
          showTabar:false
        })
      }
      this.data.backType = true
    }
    var label = this.data.detailInfo.infomation.lastIndexOf('+')
    if(label != -1){
      this.data.detailInfo.infomation = this.data.detailInfo.infomation.substring(0, label)
    }

    console.log(this.data.detailInfo)
    this.setData({
      detailInfo: this.data.detailInfo
    })                         
    if (this.data.detailInfo.kind == "遗失" ){
      if (this.data.detailInfo.confirm || this.data.detailInfo.timeOut != null ){
        this.setData({
          isHasFind: "失物已被找到"
        })
      }else {
        this.setData({
          isHasFind: "失物未被找到"
        })
      }
    } else if (this.data.detailInfo.kind == "招领" ){
      if (this.data.detailInfo.confirm || this.data.detailInfo.timeOut != null) {
        this.setData({
          isHasFind: "已找到失主"
        })
      } else {
        this.setData({
          isHasFind: "未找到失主"
        })
      }
    }
    /**
     * 改变联系方式样式
     */
    var StrList = this.data.detailInfo.contactWay.split("+");
    console.log(this.data.contactList[parseInt(StrList[0])])
    this.setData({
      contactWay:this.data.contactList[parseInt(StrList[0])],
      contact:StrList[1]
    })
    /**
     * 图片名格式 height width timestamp openid.type
     * 调整图片大小
     * 默认图片名字无大小信息，并且不会显示，所以不符合正则表达式就不显示
     */
    var that = this
    wx.getSystemInfo({
      success(res) {
        console.log(res.windowWidth)
        that.data.windowWidth = res.windowWidth * 0.94;
        var size = that.data.detailInfo.picPath.split("+")
        //默认照片不会被切分，所以长度为1
        if(size.length > 2){
          console.log(size)
          var height = parseInt(size[1])
          var width = size[2]
          /**
           * 如果宽大于屏幕长度，则让照片宽等于屏幕宽，让照片高按照倍率缩小。
           * 从而做到等比例缩小照片
           */
          if (width > that.data.windowWidth) {
            var a = width / that.data.windowWidth
            width = that.data.windowWidth
            height = height / a
          }
          if (height != null & width != null) {
            that.setData({
              imgHeight: height,
              imgWidth: width
            })
          }
        } 
      }
    })
    if (this.data.detailInfo.confirm != null){
      if (app.globalData.openid == this.data.detailInfo.identity) {
        /**
         * 删除标记标记
         */
        console.log("sadsd")
        this.remind(false);
        this.setData({
          isshow: false,
          confirm: true
        })
      }
    }
  },
  /**
   * 一键复制联系方式
   */
  copy:function(){
    wx.setClipboardData({
      data: this.data.contact,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          heightWindow: res.windowHeight
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面显示
   * 获得所有评论
   */
  onShow: function () {
    var that = this
    // // this.commentCss(this.data.detailInfo.commentMysqlList);
    // var id = ""
    // var comm = this.data.detailInfo.commentMysqlList;
    // for(var i = 0 ; i < comm.length;i++){
    //   if(comm.length-1 != i){
    //     id = id + comm[i].id + ","
    //   }else{
    //     id = id + comm[i].id
    //   }
    // }
    // console.log(id)
    wx.request({
      url: app.globalData.domain + '/getComment',
      method: 'GET',
      header: app.globalData.header,
      data:{
        id: this.data.detailInfo.id
      },
      success: function(e){
        console.log(e)
        for(var i = 0 ; i < e.data.length;i++){
          if (e.data[i].commentInfo.toUid == "noUid"){
            e.data[i].commentInfo.toName = '';
          }else{
            e.data[i].commentInfo.toName = '@' + e.data[i].commentInfo.toName + "："
          }
        }
        that.setData({
          commentNum:e.data.length,
          comment:e.data,
        })
      }
    })
    wx.showShareMenu({
      withShareTicket:true
    })
  },
  commentCss:function(commentList){
    var e = { data:{}}
    e.data = commentList
    console.log(commentList)
    for (var i = 0; i < e.data.length; i++) {
      if (e.data[i].commentInfo.toUid == "noUid") {
        e.data[i].commentInfo.toName = '';
      } else {
        e.data[i].commentInfo.toName = '@' + e.data[i].commentInfo.toName + "："
      }
    }
    console.log(e.data)
    this.setData({
      commentNum: e.data.length,
      comment: e.data,
    })
  },
  sendComment:function(res){
    console.log("发送评论")
    var that = this;
    this.data.contant = res.detail.value
    console.log(app.globalData.userinfo)
    var time = new Date();
    time.toLocaleString()
    var user_id = app.globalData.userinfo.num
    var info_id = that.data.detailInfo.id
    var view = false;
    //如果用户在自己发布的评论下评论，则不记入未读
    if(that.data.detailInfo.identity == app.globalData.openid){
     view = true
    }
    wx.request({
      url: app.globalData.domain + '/writeComment/' + user_id+"/"+info_id ,
      method: 'POST',
      header: app.globalData.header,
      data:{
        content:res.detail.value,
        time: time.toLocaleString(),
        uid:app.globalData.openid,
        toUid:that.data.toUid,
        toName:that.data.toName,
        view:view,
        toView:false,
      },
      success:function(res){
        console.log(res)
        var data = res.data;
        data.avatarUrl = app.globalData.userInfo.avatarUrl;
        data.nickName = app.globalData.userInfo.nickName;
        var info = {commentInfo:{},userInfo:{}};
        info.commentInfo.content = data.content;
        info.commentInfo.id = data.id;
        info.commentInfo.time = data.time;
        info.commentInfo.identity = data.identity;
        info.commentInfo.toName = data.toName;
        info.commentInfo.toUid = data.toUid;
        info.userInfo.avatarUrl = data.avatarUrl;
        info.userInfo.nickName= data.nickName;
        that.data.comment.unshift(info);
        that.commentCss(that.data.comment)
      }
    })
  },
  openMenu:function(res){
    this.setData({
      showMenu:true,
      operating:res.currentTarget.id
    })
    if (this.data.comment[res.currentTarget.id].commentInfo.uid == app.globalData.openid){
      // this.showDeleteMenu()
      this.showMenu("delete")
      this.setData({
        upingMenu:'0'
      })
    }else {
      this.showMenu("report")
      this.setData({
        upingMenu: '1'
      })
    }
  },
  //上拉删除菜单
  showMenu:function(res){
    console.log(this.data.heightWindow)
    var length = this.data.heightWindow * 0.15;
    var animation = wx.createAnimation({
      duration:300,
      delay:0,
      timingFunction:'linear'
    })
    animation.translate(0, -length).step({ duration: 300 });
    if (res == "delete") {
      this.setData({
        deleteUp: animation.export(),
      })
    }else if(res == "report"){
      this.setData({
        reportUp: animation.export(),
      })
    }
  },
  //下拉菜单
  closeMenu: function (res) {
    console.log(res)
    this.setData({
      showMenu:false,
    })
    var length = this.data.heightWindow * 0.15;
    var animation = wx.createAnimation({
      duration: 300,
      delay: 0,
      timingFunction: 'linear'
    })
    animation.translate(0, length).step({ duration: 300 });
    if(res.currentTarget.id == "0"){
      this.setData({
        deleteUp: animation.export(),
      })
    }else if(res.currentTarget.id == "1"){
      this.setData({
        reportUp: animation.export(),
      })
    }
  },
  deleteComment:function(res){
    console.log(res)
    res.currentTarget.id = "0"
    this.closeMenu(res)
    var that = this
    var id = that.data.comment[that.data.operating].commentInfo.id
    wx.request({
      url: app.globalData.domain + '/deleteComment/'+id,
      method: 'DELETE',
      header: app.globalData.header,
      success:function(res){
        that.data.comment.splice(that.data.operating,1)
        that.setData({
          comment:that.data.comment
        })
      }
    })
  },
  //回复消息
  reply:function(res){
    var name = this.data.comment[res.currentTarget.id].userInfo.nickName
    var uid = this.data.comment[res.currentTarget.id].commentInfo.uid
    this.setData({
      inputUp:true,
      placeHolder:"@"+name+":", 
      toUid:uid,
      toName:name,
    })
  },
  //键盘拉起是让输入框正确高度显示
  rightH:function(res){
    console.log("获得焦距")
    this.setData({
      input_bottom: res.detail.height+"px",
    })
  },
  //下拉输入框，
  inputDown:function(){
    console.log("失去焦距")
    this.setData({
      input_bottom: "8%",
      inputInit: '',
      inputUp:false,
      placeHolder: "大胆提问吧",
      toUid: "noUid",
      toName: 'noName',
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
   * 因为url上只能添加字符而不能添加JSON对象，所以先把JSON转化为JSON字符串在传递
   * JSON.stringify(json) 将JSON转化为字符串
   * JSON.parse(str) 将字符串转化为JSON对象
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var data = JSON.stringify(this.data.detailInfo)
    if(res.from == 'button'){
      console.log(res)
    }
    return {
      title:"失物详细信息",
      path:'/pages/LAF/detail?data='+data,
      success:function(res){
        console.log(res)
      }
    }
  },
  /**
   * 发布信息者结束事件,更新后端数据库
   */
  finish:function(){
    var that = this
    wx.showModal({
      title: '操作确认',
      content: '是否确定',
      confirmColor:'green',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.domain +'/finish/' + that.data.detailInfo.id,
            method: 'DELETE',
            header: app.globalData.header,
            success: function (res) {
              app.globalData.isChangeInfo = that.deleteInfo()
              console.log(app.globalData.isChangeInfo )
              wx.showToast({
                title: '删除成功',
                icon:'success',
                duration:1500,
                success:function(){
                  if (that.data.backType) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.redirectTo({
                      url: 'index',
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 更新前端数据
   */
  deleteInfo:function(){
    for (var i = 0; i < app.globalData.info.length ; i++){
      if(this.data.detailInfo.id == app.globalData.info[i].id){
        app.globalData.info.splice(i, 1)
        return true
      }
    }
    for (var i = 0; i < app.globalData.valuable.length; i++) {
      if (this.data.detailInfo.id == app.globalData.valuable[i].id) {
        app.globalData.valuable.splice(i, 1)
        app.globalData.imgList.splice(i,1)
        return true
      }
    }
    return false
  },
  /**
 * 显示模态对话框
 */
  showDialogBtn: function () {
    this.setData({
      showModal: true
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
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 失主留言
   */
  message:function(res){
    console.log("ads")
    console.log(this.data.detailInfo)
    this.data.message = app.globalData.userInfo.nickName+":"+res.detail.value
    this.setData({

    })
  },
  /**
   * 获取formId以及access_token用于发送模板
   */
  get_access_token:function(res){
    var that = this
    that.setData({
      formId: res.detail.formId
    })
    wx.request({
      url: app.globalData.domain +'/get_access_token',
      method: "GET",
      header: app.globalData.header,
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        })
        //加标记
        that.remind(true);
        //发模板信息
        that.sendMessage();
      }
    })
       
  },
  /**
   * 提醒拾取人失主找到失物，待确认
   */
  remind:function(res){
    console.log(res)
    wx.request({
      url: app.globalData.domain +'/confirm/' + this.data.detailInfo.id,
      method: 'PUT',
      header: app.globalData.header,
      data: {
        confirm: res
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 发送模板信息
   */
  sendMessage:function(){
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 1500,
    })
    if (this.data.message == "") {
      this.setData({
        message: app.globalData.userInfo.nickName + ":谢谢"
      })
    }
    var that = this
    console.log(that.data.detailInfo.id)
    /**
     * 添加标记
     */
    that.remind(true);
    var time = new Date();
    var current = time.toLocaleDateString() + time.toLocaleTimeString();
    wx.request({
      url: app.globalData.domain +'/sendTemplateInfo',
      method:'GET',
      header: app.globalData.header,
      data:{
        id:that.data.detailInfo.id,
        accessToken:that.data.access_token,
        openid:that.data.detailInfo.identity,
        category: that.data.detailInfo.category,
        current:current,
        nickName:app.globalData.userInfo.nickName,
        message:that.data.message
      },
      success:function(res){
        if(res.data == false){
          wx.showToast({
            title: '发送失败，该失主已找到失主',
            duration: 1000,
            icon:'none',
            success: function () {
              setTimeout(function () {
                if (that.data.backType) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.redirectTo({
                    url: 'index',
                  })
                }
              }, 1000)
            }
          }) 
        }else{
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              setTimeout(function () {
                if (that.data.backType) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.redirectTo({
                    url: 'index',
                  })
                }
              }, 1000)
            }
          }) 
        }
      }
    })
    
  },
  affirm:function(){

  }
  })