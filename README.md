# wx_Lost-Find
基于微信小程序和java的springboot

## 版本2.6

### 优化
* 优化首界面显示，登录开始1.5显示图片从而让检验用户是否授权请求得以响应，让用户看不到授权框。
* 优化删除全部历史记录，用户需要再次确认。
* 优化`detail界面`的`确认失物按钮`,点击不再需要再次确认，换为想发布者留言。
* 删除从`service界面`进入`upload界面`。
### 后端
* 增加拦截器用来拦截没有登录态的用户访问，方法为token+session模式。
* 由于小程序无法传递sessionId，在header手动保存sessionid以及token，故重写sessionContext以及写session监听器。
* 增加删除全部历史记录
### bug
* 手机端`upload界面`信息类型样式与开发者工具不一致
