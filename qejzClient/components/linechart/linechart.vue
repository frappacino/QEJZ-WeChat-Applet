<template>
	<view @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
		<view class="datetype">
			<view class="showTime">
				<picker mode="date" :value="dateVal" fields="year" :start="startDate" :end="endDate"
					@change="dateChange" class="date">
					<view class="datey">{{formdateyear}}年
						<text class="iconfont icon-xiajiantou icon"></text>
					<!-- <view class="arrow"></view> -->
					</view>
				</picker>
			</view>
		</view>
		<!-- 日期 -->
		<!-- 图表 -->
		<view id="myChart" ref="chart" style="width: 100%; height: 200px">
			<qiun-data-charts type="line" :chartData="chartData" background="none"
				:opts="{legend:{position: 'bottom'},extra:{radar:{border:true}}}" />
		</view>
		<!-- 按月份分类列表 -->
		<view class="listArea">
			<view class="listTitle">
				<text>月份</text>
				<text>收入</text>
				<text>支出</text>
				<text>结余</text>
			</view>
			<view v-if="haveCounts">
				<view class="listContents" v-for="(item,k) in indexDetail" :key="k">
					<view class="listItem">
						<text>{{item.month}}月</text>
						<text>{{item.moneyin}}</text>
						<text>{{item.moneyout}}</text>
						<text>{{item.moneymore}}</text>
					</view>
				</view>
			</view>

			<view v-else class="listAreano">
				<view class="listItemno">没有数据哦！</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "linechart",
		props: ["fuScrollTop", "fupdrf"],
		data() {
			return {
				haveCounts: false,
				dateVal: "",
				filtertime: '',
				formdateyear: '',
				oldDetailList: [], //根据日期控件整理对应年份的数据
				arrayDetailList: [], //整理出每月的数据
				indexDetail: [], //整理好的给账单分类列表的数据
				inEchartsDetail: [], //整理好的给echarts图表的数据
				outEchartsDetail: [], //整理好的给echarts图表的数据
				innewDetail: [], //收入数据
				outnewDetail: [], //支出数据
				chartData: {
					categories: [
						"1月", "", "3月", "", "5月", "", "7月", "", "9月", "", "11月", ""
					],
					series: [{
							name: "支出",
							data: [0,0,0,0,0,0,0,0,0,0,0,0],
							label: {
								show: true,
								position: "right"							    
							},
						},
						{
							name: "收入",
							data: [0,0,0,0,0,0,0,0,0,0,0,0],
							label: {
								show: true,
								position: "left"
							},
						}
					]
				},
			};
		},
		created() {
			// 初始化当前日期
			this.dateVal = new Date();
			this.filtertime = this.$myformatDate(this.dateVal, 0);
			// 格式化成年月
			this.formdateyear = this.$myformatDate(this.dateVal, 3);
			this.formdatemonth = this.$myformatDate(this.dateVal, 4);
			this.getAllDetail();
		},
		methods: {
			// 获取数据列表
			async getAllDetail() {
				this.oldDetailList = []; //防止每次刷新数据重复叠加
				const res = await this.$myRuquest({
					url: '/api/getDetail'
				})
				let alldata = res.data.message;
				this.filterTime(alldata); // 筛选当前日期列表
				this.arrayDetailList = this.arrayDetail(this.oldDetailList); // 按月份分组
				this.inORout(this.arrayDetailList);
				this.listMonthData(this.arrayDetailList);
				this.echartsdata(this.outnewDetail);
				this.echartsdata(this.innewDetail);
			},
			// 选择日期
			dateChange(e) {
				this.dateVal = e.target.value.slice(0, 7);
				this.filtertime = this.dateVal;
				this.formdateyear = e.target.value.slice(0, 4);
				this.oldDetailList = [];
				this.getAllDetail();
			},
			// 筛选当前日期列表
			filterTime(p) {
				p.forEach((element, i) => {
					if (
						this.filtertime.substring(0, 4) == element.addtime.substring(0, 4)
					) {
						// console.log('筛选的数据：' + JSON.stringify(element)); //重点!!一定要用JSON.stringify
						// console.log('当年的时间：' + this.filtertime.substring(0,4) + '后台数据的' +element.addtime.substring(0,4));
						this.oldDetailList.push(element);
					}
				});
			},
			// 按月份分组
			arrayDetail(data) {
				//定义一个空数组
				let newArr = [];
				//通过forEach循环数组
				data.forEach((item, i) => {
					let index = -1;
					//然后在跑到这里筛选 根据不同的时间放置不同的数组    some（）用来查找数组中是否存在某个值  如果存在 就return true
					let isExists = newArr.some((newItem, j) => {
						let itemform = this.$myformatDate(item.addtime, 0).substring(6, 7);
						let newItemform = this.$myformatDate(newItem.addtime, 0).substring(6, 7);
						if (itemform == newItemform) {
							index = j;
							return true;
						}
					});
					//代码是先跑这里的if条件判读
					if (!isExists) {
						newArr.push({
							addtime: item.addtime,
							subList: [item],
						});
					} else {
						newArr[index].subList.push(item);
					}
				});
				return newArr;
			},
			//整理支出还是收入的数据
			inORout(detail) {
				// console.log(detail);
				let b = [];
				let c = [];
				for (var i = 0; i < detail.length; i++) {
					for (var j = 0; j < detail[i].subList.length; j++) {
						if (detail[i].subList[j].consumetype == 'inType') {
							c.push(detail[i].subList[j]);
						} else if (detail[i].subList[j].consumetype == 'outType') {
							b.push(detail[i].subList[j]);
						}
					}
				}
				this.innewDetail = this.arrayDetail(c);
				this.outnewDetail = this.arrayDetail(b);
				// console.log(this.innewDetail);
				// console.log(this.outnewDetail);
			},
			// 整理画折线图需要的数据
			echartsdata(detail) {
				// console.log(detail);
				let sum = 0;
				let filtertime = '';
				let month = 0;
				let category = ["1月", "", "3月", "", "5月", "", "7月", "", "9月", "", "11月", ""];
				this.chartData.categories = category;
				if (detail.length !== 0) {
					console.log("有图");
					for (var i = 0; i < detail.length; i++) {
						for (var j = 0; j < detail[i].subList.length; j++) {
							sum += detail[i].subList[j].money;
							filtertime = this.$myformatDate(detail[i].addtime, 0).substring(5, 7);
							month = filtertime - 1;
						}
						if (detail == this.outnewDetail) {
							this.chartData.series[0].name = "支出";
							this.chartData.series[0].data[month] = sum;
						} else if (detail == this.innewDetail) {
							this.chartData.series[1].name = "收入";
							this.chartData.series[1].data[month] = sum;
						}
						sum = 0;
					}
				} else {
					console.log("没有图");
					
					for (var i = 0; i < 11; i++) {
						for (var j = 1; j < 13; j++) {
							sum = 0;
							month = j - 1;
							this.chartData.series[0].name = "支出";
							this.chartData.series[0].data[month] = sum;
							this.chartData.series[1].name = "收入";
							this.chartData.series[1].data[month] = sum;
						}
						sum = 0;
					}
				}
			},
			// 整理列表需要的数据
			listMonthData(detail) {
				// console.log(detail);

				let allout = 0,
					allin = 0,
					month = 0,
					more = 0,
					filtertime = 0;
				if (detail.length !== 0) {
					this.indexDetail = [];
					for (var i = 0; i < detail.length; i++) {
						for (var j = 0; j < detail[i].subList.length; j++) {
							if (detail[i].subList[j].consumetype == 'outType') {
								allout += detail[i].subList[j].money;
							} else if (detail[i].subList[j].consumetype == 'inType') {
								allin += detail[i].subList[j].money;
							}

							filtertime = this.$myformatDate(detail[i].addtime, 0).substring(5, 7);
						}
						let rest = allin - allout;
						more = parseFloat(rest.toFixed(2));
						this.haveCounts = true;
						console.log("有");
						// 添加新对象在空数组里
						this.indexDetail.push({
							moneyin: allin,
							moneyout: allout,
							moneymore: more,
							month: filtertime,
						})
						allout = 0,
							allin = 0,
							month = 0,
							more = 0
					}
				} else {
					console.log("没有");
					this.haveCounts = false;
				}

				this.compare(this.indexDetail);
				console.log(this.indexDetail);
			},
			// 排序方法--降序，最新日期在前
			compare(list) {
				for (let i = 0; i < list.length; i++) {
					for (let j = i; j < list.length; j++) {
						// let comparetimei = this.$options.filters["formatDate"](list[i].addtime);
						// let comparetimej = this.$options.filters["formatDate"](list[j].addtime);
						if (list[j].month - list[i].month > 0) {
							let listObj = list[i];
							list[i] = list[j];
							list[j] = listObj;
						}
					}
				}
				return list;
			},
			// 开始触摸
			handleTouchStart(event) {
				// console.log(event.touches[0]);
				let touch = event.touches[0];
				this.startX = Number(touch.pageY);
			},
			handleTouchMove(event) {

				// 1.获取第一个触点
				let touch = event.touches[0];
				// 2.求出移动的距离
				this.moveWidth = Number(touch.pageY) - this.startX;
			},
			handleTouchEnd() {
				console.log(this.fuScrollTop);
				// console.log(this.$refs.scroll.getBoundingClientRect().top);
				if (this.moveWidth > 0 && this.fuScrollTop == 0 && this.fupdrf == '1') {
					this.getAllDetail();
					setTimeout(function() {
						uni.showToast({
							icon: 'success',
							title: '刷新成功'
						})
						uni.stopPullDownRefresh();
					}, 1000);
				}
			}
		}
	}
</script>

<style>
	/* 日期控件 */
	.datetype {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	.date {
		height: 44px;
		margin-left: 10px;
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

	.datey {
		font-size: 14px;
	}
	.datey .icon {
		font-size: 14px;
		margin-left: 4px;
	}

	.datem {
		font-size: 18px;
		font-weight: 600;
	}

	.btn {
		margin-right: 10px;
		background-color: #FFA800 !important;
	}

	/* 每月支出收入详细列表 */
	/* 无数据列表 */
	.listAreano {
		border-top: 1px solid #ffa800;
	}

	.listItemno {
		padding: 5px 20px;
		border-bottom: 1px solid #ffa800;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 15px;
	}

	/* 有数据列表 */
	.listArea {
		margin-top: 20px;
		margin-bottom: 100px;
	}

	.listTitle {
		display: flex;
		height: 24px;
		line-height: 24px;
		font-size: 16px;
		justify-content: space-around;
		background-color: #ffa800;
		color: black;
	}

	.listItem {
		display: flex;
		justify-content: space-between;
		padding: 0 36px;
		border-bottom: 1px solid #ffa800;
		font-size: 13px;
	}
</style>
