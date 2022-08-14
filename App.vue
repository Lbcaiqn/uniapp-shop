<script setup>
import {onLaunch} from '@dcloudio/uni-app'

onLaunch(() => {
    uni.showModal({
        title: '提示',
        showCancel: false,
        confirmText: '我知道了',
        content: `该小程序只做测试用，并无真正的支付等功能; 由于部分后端数据缺失，会使部分数据显示不全; 暗色模式同步于微信设置`
    })
})
</script>

<style>
@media (prefers-color-scheme: dark) {
  page{
    background: #000;
    color: #fff;
  }
}
</style>
