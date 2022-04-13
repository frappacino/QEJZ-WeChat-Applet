<template>
	<view>
		<view class="topArea">
			<view class="title">
				<view class="people"><text>向&nbsp;{{people}}&nbsp;{{type}}</text></view>
				<view class="remarks">{{remarks}}</view>
			</view>
			<view class="counts">
				<view class="jie">
					<view class="jine">{{totalout}}</view>
					<view v-if="loantype">已收</view><!-- 即使是v-if里的变量，在uniapp里用到data里的变量都不需要加this. -->
					<view v-else>已还</view>
				</view>
				<view class="right">
					<view class="jine">{{totalin}}</view>
					<view v-if="loantype">还需收</view>
					<view v-else>还需还</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="tag_content">
			<view class="tag_area">
				<view class="tag_item">
					<view class="left">
						<view class="type">{{type}}</view>
						<view class="date">{{date}}</view>
					</view>
					<view class="right">{{money}}</view>
				</view>
				<view class="tag_item" v-for="item in loanbacklist" :key="item.id">
					<view class="left">
						<view class="type">{{item.type}}</view>
						<view class="date"><text>{{item.date}}&nbsp;&nbsp;备注：{{item.remarks}}</text></view>
					</view>
					<view class="right">
						<view class="tag_name">
							{{item.money}}
						</view>
						<text class="iconfont icon-shanchu delicon" @click.stop="clickDelLoanBack(item.id)"></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="balArea">
			<view class="btn" @click="goloanback(id,backtype)">{{backtype}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: {},
				people: '',
				money: 0,
				remarks: '',
				date: '',
				id: 0,
				type: '',
				backtype: '',
				totalout: 0,
				totalin: 0,
				loanbacklist: [],
				loantype: true
			}
		},
		onLoad(options) {
			this.list = JSON.parse(decodeURIComponent(options.item));
			this.getAllLoanBack();
			this.getSelectedLoanBack();
		},
		onPullDownRefresh() {
			this.getAllLoanBack();
			this.getSelectedLoanBack();
			setTimeout( ()=> {
				uni.stopPullDownRefresh(); // 0.5s之后触发（异步）
				console.log('加载完成，更新数据');
			}, 500); // 下拉刷新持续显示0.5s
		},
		onShow() {
			let isRefresh = getApp().globalData.myLoanBackRefresh;
			console.log(isRefresh);
			if(isRefresh == true) {
				this.getAllLoanBack();
				this.getSelectedLoanBack();
				getApp().globalData.myLoanBackRefresh = false;
			}
		},
		methods: {
			// 获取收款还款数据列表
			async getAllLoanBack() {
				this.loanbacklist = [];
				const res = await this.$myRuquest({
					url: '/api/getLoanBack/' + this.list.id,
				})
				console.log(res);
				if (res.data.success_code === 200) {
				  this.loanbacklist = res.data.message;
				  for(let it in this.loanbacklist) {
					this.loanbacklist[it].date = this.$myformatDate(this.loanbacklist[it].date,0);
				  }
				  this.totalGoings();
				} else {
				  console.log("error");
				}
			},
			// 获取点击的收款还款信息
			getSelectedLoanBack() {
				this.people = this.list.people;
				this.remarks = this.list.remarks;
				this.money = this.list.money;
				this.date = this.$myformatDate(this.list.date,0);
				this.type = this.list.type;
				console.log(this.type);
				this.id = this.list.id;
				if (this.type == "借出") {
				  this.backtype = "收款";
				  this.loantype = true; //控制还款类型字体显示
				} else if (this.type == "借入") {
				  this.backtype = "还款";
				  this.loantype = false;
				}
			},
			// 删除某条收款还款记录接口
			async delSelectedLoanBack(index) {
				this.id = index;
				const res = await this.$myRuquest({
					url: '/api/deleteLoanBack/'+this.id 
				})
			    if (res.data.flag = 1) {
			      console.log("删除成功")
			    } else if (res.data.flag = 2){
			      console.log("error");
			    }
			},
			// 删除选中收款还款
			clickDelLoanBack(index) {
				console.log(index)
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此条收款还款记录吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.delSelectedLoanBack(index);
							// 重新刷新
							that.getAllLoanBack();
							that.getSelectedLoanBack();
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			},
			//支出计算
			totalGoings() {
			  this.totalout = 0;
			  this.totalin = 0;
			  for (let i = 0; i < this.loanbacklist.length; i++) {
			    this.totalout += parseInt(this.loanbacklist[i].money);
			    this.totalin = parseInt(this.money) - parseInt(this.totalout);
			  }
			},
			// 跳转到收款还款页面
			goloanback(id,backtype) {
				uni.navigateTo({
					url: '/pages/loan/loanback?id=' + id + '&backtype=' + backtype
				})
			}
		}
	}
</script>

<style>
.topArea {
  width: 100%;
  height: 90px;
  background-color: #ffa800;
  text-align: center;
  letter-spacing: 1px;
  font-size: 14px;
}
.title .remarks {
  font-size: 12px;
  color: #fff;
}
.counts {
  display: flex;
  justify-content: space-around;
}
.counts .jine {
  font-size: 16px;
}
.count .jie {
	margin-left: 20px;
	display: flex;
	align-items: center;
}

.tag_area {
  padding-bottom: 50px;
  background-color: #fff;
}
.tag_item {
  width: 100%;
  display: flex;
  border-bottom: 1px solid rgb(223, 223, 223);
  padding: 10px 0;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
}
.left {
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.left .date {
  margin-left: 10px;
  border-left: 1px solid #ffa800;
  padding-left: 10px;
  color: #999;
}
.right {
	margin-right: 20px;
}
.tag_item .right:nth-of-type(2) {
	display: flex;
	align-items: center;
}
.delicon {
	margin-left: 6px;
	font-size: 24px;
	color: #999;
}

.balArea {
  background-color: #fff;
}
.btn {
  margin-left:  50%;
  transform: translateX(-50%);
  margin-bottom: 80px;
  width: 80px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  background-color: #ffa800;
  color: white;
  border-radius: 6px;
}
</style>
