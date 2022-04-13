<template>
	<view>
		<view class="topArea">
			<!-- 支出收入的切换按钮 -->
			<view class="toggle">
				<view class="out" @click="changetype($event)" :class="isActive == 'outType' ? 'active': ''" id="out">
					<text>分类</text>
				</view>
				<view class="in" @click="changetype($event)" :class="isActive == 'inType' ? 'active': ''" id="in">
					<text>趋势</text>
				</view>
			</view>
		</view>
		<!-- 图表区域 -->
		<circlechart :fuScrollTop="scrollTop" :fupdrf="pdrf" v-if="charttype" ref='pie'></circlechart>
		<linechart :fuScrollTop="scrollTop" :fupdrf="pdrf" v-else ref='line'></linechart>
	</view>
</template>

<script>
	import circlechart from '../../components/circlechart/circlechart.vue'
	import linechart from '../../components/linechart/linechart.vue'
	export default {
		components: {
			"circlechart": circlechart,
			"linechart": linechart
		},
		data() {
			return {
				charttype: true,
				isActive: 'outType',
				scrollTop: 0,
				pdrf: '0'
			}
		},
		onPageScroll(e){
			this.scrollTop = e.scrollTop;
			// console.log(e.scrollTop);
		},
		onPullDownRefresh() {
			this.pdrf = '1';
			setTimeout( ()=> {
				uni.stopPullDownRefresh(); // 0.5s之后触发（异步）
				console.log('加载完成，更新数据');
				this.pdrf = '0';
			}, 500); // 下拉刷新持续显示0.5s
		},
		methods: {
			changetype(e) {
				if (e.currentTarget.id == "out") {
				  this.isActive = 'outType';
				  this.charttype = true;
				} else if (e.currentTarget.id == "in"){
				  this.isActive = 'inType';
				  this.charttype = false;
				}
			},
		}
	}
</script>

<style>
.topArea {
  width: 100%;
  height: 70px;
  background-color: #ffa800;
  display: flex;
  padding-top: 30px !important;
  justify-content: center;
}
.toggle {
  background-color: #ffa800;
  border-radius: 6px;
  color: #333;
  width: 40%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  display: flex;
  flex-wrap: nowrap;
}
.out {
  border-radius: 6px 0 0 6px;
  border: 1px solid #333;
  width: 50%;
}
.in {
  border-radius: 0 6px 6px 0;
  border: 1px solid #333;
  width: 50%;
}
.active {
  border: 1px solid #333;
  background: #000;
  color: white;
}
</style>
