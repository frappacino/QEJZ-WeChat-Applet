<template>
	<view>
		<!-- 顶部个人信息区域 -->
		<view class="topArea">
			<image v-if="isLogin" :src="avatarUrl" mode=""></image>
			<image v-else src="../../static/img/default.jpg" mode=""></image>
			<view v-if="isLogin" class="nickname">{{nickName}}</view>
			<view v-else class="nickname">您还未登录</view> 
			<view v-if="isLogin" class="day">
				您已坚持记账 <text>{{keepDay}}</text> 天
			</view>
			<view v-else class="day">
				您已坚持记账 <text>0</text> 天
			</view>
		</view>
		<!-- 中间设置功能区域 -->
		<view class="contentsArea">
			<view class="setupList" @click="gobudget">
				<view class="left">
					<text class="iconfont icon-bianji icon"></text>
					<!-- <image src="../../static/img/setup.png" mode=""></image> -->
					<view>设置预算</view>
				</view>
				<!-- <view class="arrow"></view> -->
				<text class="iconfont icon-youjiantou icon"></text>
			</view>
			<view class="setupList" @click="gotag">
				<view class="left">
					<text class="iconfont icon-bianji icon"></text>
					<!-- <image src="../../static/img/setup.png" mode=""></image> -->
					<view>分类管理</view>
				</view>
				<!-- <view class="arrow"></view> -->
				<text class="iconfont icon-youjiantou icon"></text>
			</view>
			<view class="setupList" @click="goloan">
				<view class="left">
					<text class="iconfont icon-bianji icon"></text>
					<!-- <image src="../../static/img/setup.png" mode=""></image> -->
					<view>借款管理</view>
				</view>
				<!-- <view class="arrow"></view> -->
				<text class="iconfont icon-youjiantou icon"></text>
			</view>
			<view class="setupList" @click="goexport">
				<view class="left">
					<text class="iconfont icon-bianji icon"></text>
					<!-- <image src="../../static/img/setup.png" mode=""></image> -->
					<view>账单导出</view>
				</view>
				<!-- <view class="arrow"></view> -->
				<text class="iconfont icon-youjiantou icon"></text>
			</view>
			<view class="setupList" @click="gocontact">
				<view class="left">
					<text class="iconfont icon-bianji icon"></text>
					<!-- <image src="../../static/img/setup.png" mode=""></image> -->
					<view>客服助手</view>
				</view>
				<!-- <view class="arrow"></view> -->
				<text class="iconfont icon-youjiantou icon"></text>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="buttonArea">
			<button type="default" class="toggle" value="" @click="weixinlogin"><text>登录</text></button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				userinfo: {},
				codeparams: {},
				nickName: '',
				avatarUrl: '',
				keepDay: ''
			}
		},
		onLoad() {
			this.getRgstDay();
			if(uni.getStorageSync('token') !== '') {
				this.isLogin = true;
				this.nickName = JSON.parse(uni.getStorageSync('userinfo')).nickName;
				this.avatarUrl = JSON.parse(uni.getStorageSync('userinfo')).avatarUrl;
				this.keepDay = uni.getStorageSync('keepDay');
			}
			
		},
		methods: {
			gobudget() {
				uni.navigateTo({
					url:'/pages/setBudget/setBudget'
				})
			},
			gotag() {
				uni.navigateTo({
					url:'/pages/classify/classify'
				})
			},
			goloan() {
				uni.navigateTo({
					url:'/pages/loan/loan'
				})
			},
			goexport() {
				uni.navigateTo({
					url:'/pages/listexport/listexport'
				})
			},
			gocontact() {
				uni.navigateTo({
					url:'/pages/customerservice/customerservice'
				})
			},
			//判断坚持记账多少天
			fmtday(data){
				var minutes=1000*60;
				var hours=minutes*60;
				var days=hours*24;
				
				var d=new Date();
				var t=d.getTime();
				var x=new Date(data).getTime()
				
				var y=Math.round((t-x)/days);
				uni.setStorageSync('keepDay', y);
				this.keepDay = uni.getStorageSync('keepDay');
			},
			async getwxopenid (){
				const res = await this.$myRuquest({
					url: '/api/getOpenid',
					method: 'post',
					data: this.codeparams
				})
				console.log(res.data.message[1]);
				let rgstDate = res.data.message[1];
				this.fmtday(rgstDate);
				uni.setStorage({
				    key:'token',
				    data: res.data.message[0],
				    success() {
				        console.log('成功了')
						uni.switchTab({
							url: '/pages/me/me',
							success(){
							let page = getCurrentPages().pop();  //跳转页面成功之后
								if (!page) return;  
								page.onLoad(); //如果页面存在，则重新刷新页面
							}
						})
				    },
				    fail() {
				        console.log('缓存失败了')
				    }
				});
				
			},
			// 获取坚持记账天数
			async getRgstDay (){
				const res = await this.$myRuquest({
					url: '/api/getKeepDay'
				})
				console.log(res.data.message[0].registerDate);
				let rgstDate = res.data.message[0].registerDate;
				this.fmtday(rgstDate);
			},
			weixinlogin() {
				let that = this;
				// console.log('点击')
				//获取授权信息
				// wx.getSetting({
				// 	success: res => {
				// 		console.log(res);
				// 		if (res.authSetting['scope.userInfo']) {
							var code = '';
							//向微信服务器获取code
							wx.login({
								success: res => {
									// console.log(res.code);
								  // 发送 res.code 到后台换取 openId, sessionKey, unionId
									uni.setStorageSync('code',res.code);//获取登录的临时凭证
								}
							});
									//向微信服务器获取userinfo
									uni.getUserProfile({
										desc:'Wexin',     // 这个参数是必须的
										
										success:res=>{
											
											console.log(res.userInfo.nickName);
											
											uni.setStorageSync('userinfo',res.rawData);
											
											
											if (uni.getStorageSync('code')) {
												that.codeparams = {
													"code": uni.getStorageSync('code'),
													"encryptedData": res.encryptedData,
													"iv": res.iv,
													"nickName": res.userInfo.nickName
												}
												console.log(that.codeparams);
												// 换取openid接口
												that.getwxopenid()
											}
											
										}
									})
									
								
							
						// }
								// 		  //获取用户信息：getUserInfo必须是在用户已经授权的情况下调用
								// 		  wx.getUserInfo({
								// 		// 	withCredentials: true,
								// 			success: res => {
								// 				// console.log(res);
								// 				that.userInfo = res.userInfo //非敏感用户信息
								// 				that.codeparams = {
								// 					"code": code,
								// 					"encryptedData": res.encryptedData,
								// 					"iv": res.iv
								// 				}
								// 				// 换取openid接口
								// 				that.getwxopenid()
								// 			}
								// 		  })
						
				//     }
				// })
			}
		}
	}
</script>

<style>
/* 顶部 */
.topArea {
  background-color: #ffa800;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.topArea image {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 30px 0 24px 0;
}
.topArea .nickname{
  color: #333;
  font-size: 18px;
}
.topArea .day {
  margin-top: 2px;
  color: white;
}
.topArea .day text {
	margin: 0 3px;
}
/* 中间 */
.contentsArea .setupList {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #ffa800;
  height: 50px;
  line-height: 50px;
}
.contentsArea .left {
  display: flex;
  align-items: center;
  font-size: 16px;
}
.contentsArea .left .icon {
  margin-right: 8px;
  font-size: 18px;
}
.arrow{
  width: 10px;
  height: 10px;
  border-top: 1px solid #333;
  border-right: 1px solid #333;
  transform: rotate(45deg);
  margin-top: 18px;
}
/* 按钮 */
.buttonArea {
  display: flex;
  justify-content: center;
  /* margin-top: 50px; */
}
.toggle {
  background-color: #ffa800 !important;
  border-radius: 6px;
  height: 38px;
  line-height: 38px;
  margin-top: 30px;
}
.toggle text {
  color: #FFFFFF;
  font-size: 16px;
}
</style>
