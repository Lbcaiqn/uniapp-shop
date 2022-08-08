<template>
    <view>
        <view @click="clearShopcartData">清空</view>
        {{shopcartStore.list}}
    </view>
</template>

<script setup>
    import useBadge from '../../hooks/useBadge.js'
    useBadge()
import {ShopcartStore} from '../../store/index.js'
const shopcartStore = ShopcartStore()

function clearShopcartData(){
    uni.setStorageSync('shopcartData',JSON.stringify({}))
    shopcartStore.list = {}
    uni.setTabBarBadge({
        index: 2,
        text: ''
    })
}
</script>

<style>

</style>
