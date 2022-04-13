<template>
	<view>
		<view class="setupArea">
		  <text>QQ邮箱：</text>
		  <input type="text" placeholder="点击输入" v-model="QQmailAddr" />
		</view>
		<view class="buttonArea">
		  <button class="toggle" @click="exportExcel">导出</button>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				QQmailAddr: ''
			}
		},
		methods: {
			// 获取数据列表
			async exportDetailBill (QQmail){
				const res = await this.$myRuquest({
					url: '/api/exportDetailExcel/' + QQmail,
				})
				uni.showToast({
					title: res.data.message,
					icon:'none',
					duration: 2000
				});
			},
			// 点击导出按钮
			exportExcel() {
				var vrfOK = this.isEmail(this.QQmailAddr)
				if (vrfOK) {
					console.log('发邮件')
					this.exportDetailBill(this.QQmailAddr);
				} else {
					console.log(vrfOK)
					uni.showToast({
						title: '请输入正确的邮箱地址',
						icon:'none',
						duration: 1000
					});
				}
			},
			// 验证邮箱地址
			isEmail(str){
				var reg = /^([a-zA-Z0-9_-])+@qq.com+/;
				return reg.test(str);
			}
		}
	}
</script>

<style>
.setupArea {
  display: flex;
  border-bottom: 1px solid rgb(235, 235, 235);
  padding: 4px 15px;
  align-items: center;
}
.setupArea text {
  width: 34%;
  font-size: 14px;
  margin: 0;
  color: #666;
}
.setupArea input {
  border: none;
  margin: 0;
  font-size: 14px;
  width: 100%;
  height: 30px;
}
.buttonArea {
  display: flex;
  justify-content: center;
  margin-top: 300px;
}
.toggle {
  width: 80px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: center;
  background-color: #ffa800;
  color: white;
  border-radius: 6px;
}
</style>
