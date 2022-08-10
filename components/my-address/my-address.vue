<template>
    <view class="my-address">
        <view v-if="JSON.stringify(addressStore.address) == '{}'" class="select-address"><button type="primary" size="mini" @click="selectAddress">选择收获地址+</button></view>
        <view class="address-message" v-else @click="selectAddress">
            <view>
                <view>{{addressStore?.address?.userName}}</view>
                <view>{{addressStore?.address?.telNumber}} <uni-icons type="right" :size="22"></uni-icons></view>
            </view>
            <view>
                <view>{{addressStore?.fullAddress}}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import {AddressStore} from '../../store/index.js'
const addressStore = AddressStore()

async function selectAddress(){
    addressStore.address = await uni.chooseAddress()
    uni.setStorageSync('addressData',JSON.stringify(addressStorage.address))
}

</script>

<style scoped lang="less">
.my-address {
   border-bottom: 3vw solid orange;
}
.select-address {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3vw;
    height: 15vh;
}
.address-message {
    margin: 8vw;
    font-size: 5vw;
    >view:first-child {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8vw;
    }
}
</style>