/**
 * 封装RestFul风格的请求
 * @param url
 * 使用class生成API实例 例如 let Goods = resource('goods',{number:numberTypes})
 * 静态具有query,post,put,patch,delete方法
 * 实例具有$save,$update,$delete方法
 * 使用实例query以及get后的数据，具有$update,$patch,$delete方法
 * query后的数据为数组，分页属性为数组的属性
 * urlMap[url]判断继承的类url后面传入的是id还是sku
 */
import { urlMap, urlConfig } from './utils'
import publicResource from './public-resource'
function resource(url) {
    let currentUrl = urlConfig[url] ? `/user/api/v1/${url}` : `/web/api/v1/${url}`
    class inheritResource extends publicResource {
        static url = currentUrl
        static id = urlMap[url] ? urlMap[url] : 'id'
        constructor(params) {
            super(params, currentUrl)
        }
    }
    return inheritResource
}

export default resource