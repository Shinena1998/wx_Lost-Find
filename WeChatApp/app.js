//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    openid:null,
    power:false,
    category:null,
    checked:null,
    isManager:false,
    infoLostCss: { time: "丢失时间", place: "丢失地点" },
    infoFindCss: { time: "拾取时间", place: "拾取地点" },
  }
})