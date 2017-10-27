/**
 * 封装RestFul风格的请求
 * @param url
 * 使用class生成API实例 例如 let Goods = resource('goods',{number:numberTypes})
 * 静态具有query,post,put,patch,delete方法
 * 实例具有$save,$update,$delete方法
 * 使用实例query以及get后的数据，具有$update,$patch,$delete方法
 * query后的数据为数组，分页属性为数组的属性
 * urlMapOne[url]判断公共的类url后面传入的是id还是sku
 */
import { addFunc, urlMapOne } from './utils'
class publicResource {
    constructor(params, url) {
            this.params = params
            this.url = url
            this.id = urlMapOne[url] ? urlMapOne[url] : 'id'
        }
        // 实例方法
    $save() {
        return publicResource.http.post(this.url, this.params).then(res => res.data)
    }
    $update = () => {
        return publicResource.http.put(`${this.url}/${this.params[this.id]}`, this.params).then(res => res.data)
    }
    $delete = () => {
            return publicResource.http.delete(`${this.url}/${this.params[this.id]}`)
        }
        // 静态方法
    static query(params = {}) {
        return publicResource.http.get(this.url, { params }).then(res => {
            let data = res.data
            let tempArray

            // 没有分页
            if (_.isArray(data)) {
                tempArray = data
            } else {
                // 进行了分页拷贝其他属性
                tempArray = data.rows
                if (!data.rows) {
                    return tempArray = data
                }
                _.forEach(res.data, (value, key) => {
                    if (key !== 'rows') {
                        tempArray[key] = res.data[key]
                    }
                })
            }
            if (tempArray.length) {
                tempArray.forEach((item) => addFunc.call(this, item, publicResource.http))
            }
            return tempArray
        })
    }

    static get(params = {}) {
        return publicResource.http.get(`${this.url}/${params[this.id]}`).then(res => {
            let data = res.data
            addFunc.call(this, data, publicResource.http)
            return data
        })
    }

    static post(data = {}) {
        return publicResource.http.post(this.url, data).then(res => res.data)
    }

    static put(params = {}) {
        return publicResource.http.put(`${this.url}/${params[this.id]}`, params).then(res => res.data)
    }

    static patch(params = {}) {
        return publicResource.http.patch(`${this.url}/${params[this.id]}`, params).then(res => res.data)
    }
    static delete(params = {}) {
        return publicResource.http.delete(`${this.url}/${params[this.id]}`)
    }
}
export default publicResource