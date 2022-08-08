import {onShow} from '@dcloudio/uni-app'
import {ShopcartStore} from '../store/index.js'
export default function useBadge(){
    const shopcartStore = ShopcartStore()
    onShow(() => {
       uni.setTabBarBadge({
           index: 2,
           text: shopcartStore.getListSum + '' == '0' ? '' : shopcartStore.getListSum + ''
       })
    })
}