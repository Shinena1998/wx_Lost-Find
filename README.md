# wx_Lost-Find
基于微信小程序和java的springboot

## 版本3.0（重置版完成了，👏）
首先重置了什么，后端微调，前端翻新。其次为什么要重置，在做2.8版本时，后半段时间基本都在优化后端，并没有太在意前端，而且对自己做的前端界面的要求是看得过眼就行，后端信心满满的做的安全功能和分页功能以及查询功能后就开始得意洋洋，以为自己已经做的够好了。做好以后就开始让同学们使用，目的是为了测出程序bug以及速度体验，并且希望分享一些经验。但是，现实很残酷，无论我让谁看我做的小程序，他们第一眼都是“你这个界面也太丑了吧”，然后就很不情愿的发条信息，随便应付我一下。虽然好的是并没有什么逻辑bug，但这和我想到的反应完全不一样，我原以为他们会为各种前端功能，后端优化而着迷，事实上却是因为界面丑其他都已经不重要了，因为对他们来说他们对这个小程序已经毫无兴趣了。由此我才体会到前端界面的重要性到底有多大，而且不能太以自己的标准看待问题。经过这次前端重置，不管是美是丑，但已经是我的设计极限了，如果有人有好的想法，可以在小程序内部提意见，如果你是大佬，而且对我这个小程序有兴趣，源码全部在下面，欢迎你自己二次创作。

### 优化
* 优化授权方式
* 优化建议界面
* 优化`上传界面`
 * 对图片格式设计为height width timestamp openid.type，以便detail界面显示
 * 时间设置为选择输入
 * 联系方式设计为 类型+号码
 * 贵重物品点击红色叹号
* `service界面`显示顺序，（时间倒序）
### 前端
* UI全部更新
* 增加用户界面
 * 查看自己发布信息
 * 意见反馈
 * 关于小程序（未实现）
* 增加时间搜索，改为信息搜索和时间搜索
* 增加分享小程序功能
* 贵重物品背景会有特殊标记
### 后端
* 配置查看用户自己发布信息搜索以及时间搜索


