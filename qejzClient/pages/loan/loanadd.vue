<template>
	<view>
		<view class="classify">
			<text>名字：</text>
			<input type="text" placeholder="点击输入" v-model="people" />
		</view>
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
		<button class="save" @click="saveNewLoan">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				people: '',
				money: '',
				dateVal: '', //日期控件绑定的值
				date: '',
				remarks: '',
				type: '',
				activeLoan: {},
				routerType: ''
			}
		},
		onLoad(options) {
			this.routerType = options.type;
			if (this.routerType == "outType") {
				this.type = '借出';
			} else if (this.routerType == "inType") {
				this.type = '借入';
			}
			// 初始化当前日期
			this.dateVal = new Date();
			this.date = this.$myformatDate(this.dateVal, 0);
		},
		methods: {
			// 向后端接口保存新的借款
			async addNewLoan() {
				const res = await this.$myRuquest({
					url: '/api/addLoan',
					method: 'post',
					data: this.activeLoan
				})
				let msgtype = typeof res.data.message;
				if (msgtype == typeof ''){
					uni.showToast({
						title: res.data.message,
						icon:'none',
						duration: 2000
					});
				} else if (res.data.success_code === 200) {
					console.log("成功");
					console.log(res);
					this.people = "",
					this.money = "",
					this.date = "",
					this.remarks = ""
				} else console.log("error");
			},
			// 保存新的借款
			saveNewLoan() {			
				this.$set(this.activeLoan, "people", this.people);
				this.$set(this.activeLoan, "money", this.money);
				this.$set(this.activeLoan, "date", this.date);
				this.$set(this.activeLoan, "remarks", this.remarks);
				this.$set(this.activeLoan, "type", this.type);
				console.log(this.activeLoan);
				this.addNewLoan();
				getApp().globalData.myLoanRefresh = true;
				// 跳转至借款列表页面
				uni.navigateBack({
					url: '/pages/loan/loan'
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
  margin: 0;
  color: #666;
}
.classify input {
  padding: 0;
  border: none;
  width: 100%;
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
