<template>
    <view class="my-search" @click="emits('clickSearch')">
        <view class="my-search-box">
            <view><uni-icons type="search" size="12"></uni-icons></view>
            <view>搜索</view>
        </view>
    </view>
</template>

<script setup>
const emits = defineEmits(['clickSearch'])
</script>

<style scoped lang="less">
.my-search {
    display:flex;
    justify-content: center;
    align-items: center;
    height:10vh;
    background-color: #000;
    .my-search-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90%;
        height: 6vh;
        font-size: 4vw;
        background-color: #fff;
        border-radius: 10vw;
        >view:first-child {
            margin-right: 1vw;
        }
    }
}

</style>
