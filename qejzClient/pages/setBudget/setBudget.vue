<template>
	<view>
		<view class="setupArea">
		   <text>设置月预算：</text>  
		   <input type="text" placeholder="点击输入金额" v-model="budget">
		</view>
		<view class="tipArea">
			<text class="rest">{{rest}}</text>
			<text class="tip">本月剩余预算</text>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
		      rest: function() {
		          return this.budget - this.totalout;
		      }
		  },
		data() {
		    return {
		        totalout: null,
		        budget: null,
		        filtertime: ""
		    };
		},
		onLoad() {
		    this.dateVal = new Date();
			this.filtertime = this.$myformatDate(this.dateVal,0);
		    this.getAllDetail();
		},
		methods: {
			// 获取数据列表
			async getAllDetail (){
				const res = await this.$myRuquest({
					url: '/api/getDetail',
				})
				let alldata = res.data.message;
				this.oldDetailList = [];
				// 筛选当前日期列表
				this.filterTime(alldata);
				this.totalGoings();
				console.log(this.oldDetailList);
			},
			//支出计算
			totalGoings() {
			  let total = 0;
			  let _this = this;
			  for (let i = 0; i < _this.oldDetailList.length; i++) {
			    if (_this.oldDetailList[i].consumetype == "outType") {
			      _this.totalout += parseInt(_this.oldDetailList[i].money);
			    
			    } else if (_this.oldDetailList[i].consumetype == "inType") {
			      _this.totalin += parseInt(_this.oldDetailList[i].money);
			    
			    }
			    
			  }
			},
			//筛选当前日期列表
			filterTime(p){
			  let _this = this;
			  // console.log(p);
			  p.forEach((element,i) => {
			    if (_this.filtertime.substring(6,7) == element.addtime.substring(6,7) ) {
			   
			      _this.oldDetailList.push(element);
			    }
			  })
			},
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
    width: 30%;
    font-size: 14px;
    margin: 0;
    color: #666;
}
.setupArea input {
	width: 70%;
    padding: 0;
    border: none;
    margin: 0;
    font-size: 14px;
    height: 30px;
}
.buttonArea {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
.toggle {
    width: 80px;
    font-size: 16px;
    background-color: #ffa800;
    color: white;
    border-radius: 6px;
}
.tipArea {
    display: flex;
    justify-content: center;
    margin: 100px auto;
    flex-direction: column;
    align-items: center;
}
.tipArea .rest {
    color: #ffa800;
    font-size: 30px;
}
</style>
