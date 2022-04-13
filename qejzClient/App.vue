<script>
	export default {
		globalData:{
			myDetailRefresh: false,
			myTagRefresh: false,
			myChartRefresh: false,
			myLoanRefresh: false,
			myLoanBackRefresh: false
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "./static/iconfont.css"
	/*每个页面公共css */
</style>
