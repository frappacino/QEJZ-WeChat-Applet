<template>
	<view>
		<view class="classify">
			<text>金额：</text>
			<input type="text" placeholder="点击输入" v-model="money" />
		</view>
		<view class="classify">
			<text>日期：</text>
			<picker mode="date" :value="dateVal" fields="day" :start="startDate" :end="endDate"
				@change="dateChange" class="date">
				<view class="datey">{{date}}<view class="arrow"></view>
				</view>
			</picker>
		</view>
		<view class="classify">
			<text>备注：</text>
			<input type="text" placeholder="点击输入,可为空" v-model="remarks" />
		</view>
		<button class="save" @click="saveNewLoanBack">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: null,
				dateVal: '', //日期控件绑定的值
				date: '',
				remarks: '',
				type: '',
				id: 0,
				activeBack: {}
			}
		},
		onLoad(options) {
			this.setloanback(options);
			// 初始化当前日期
			this.dateVal = new Date();
			this.date = this.$myformatDate(this.dateVal, 0);
		},
		methods: {
			// 发送post请求
			async getAllLoanBack() {
				const res = await this.$myRuquest({
					url: '/api/addLoanBack',
					method: 'POST',
					data: this.activeBack,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				})
				if (res.data.success_code === 200) {
					console.log("成功");
					this.money = "",
					this.date = "",
					this.remarks = ""
				} else console.log("error");
			},
			setloanback(options) {
				this.id = options.id;
				this.type = options.backtype;
				this.$set(this.activeBack, "type", this.type);
				this.$set(this.activeBack, "loan_id", this.id);
			},
			saveNewLoanBack() {
				this.$set(this.activeBack, "money", this.money);
				this.$set(this.activeBack, "date", this.date);
				this.$set(this.activeBack, "remarks", this.remarks);
				// console.log(this.activeBack);
				this.getAllLoanBack();
				getApp().globalData.myLoanBackRefresh = true;
				// 跳转至收款还款列表页面
				uni.navigateBack({
					url: '/pages/loan/loanconcrete' 
				})
			},
			// 选择日期
			dateChange(e) {
				this.dateVal = e.target.value;
				this.date = this.dateVal;
			},
		}
	}
</script>

<style>
	.classify {
		display: flex;
		border-bottom: 1px solid rgb(235, 235, 235);
		padding: 4px 20px;
		align-items: center;
	}

	.classify text {
		width: 20%;
		font-size: 14px;
		color: #666;
		text-align: center;
	}

	.classify input {
		width: 100%;
		padding: 0;
		border: none;
		margin: 0;
		font-size: 14px;
		height: 30px;
	}
	
	/* 日期控件 */
	.date {
		font-size: 14px;
		width: 100%;
		height: 30px;
		line-height: 30px;
	}
	.date .arrow {
		width: 6px;
		height: 6px;
		border-bottom: 2px solid #000000;
		border-left: 2px solid #000000;
		transform: rotate(-45deg);
		margin: 0 0 4px 6px;
		display: inline-block;
	}

	.save {
		margin-left: 50%;
		transform: translateX(-50%);
		margin-top: 80px;
		width: 80px;
		font-size: 16px;
		background-color: #ffa800;
		color: white;
		border-radius: 6px;
	}
</style>
