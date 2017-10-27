/**
 * Install plugin
 * @param Vue
 * @param axios
 */
import publicResource from './public-resource'
import { interceptor, userInterceptor, addToken } from './utils'

function plugin(Vue, axios, store) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true
    if (!axios) {
        console.error('You have to install axios')
        return
    }
    let http = axios.create()
    let clearAxios = axios.create()
    let userAxios = axios.create()
    Vue.axios = publicResource.http = http
    Vue.clearAxios = clearAxios
    Object.defineProperties(Vue.prototype, {
            axios: {
                get() {
                    return userAxios
                }
            },

            $http: {
                get() {
                    return http
                }
            },
            Resource: {
                get() {
                    return Resource
                }
            },
            clearAxios: {
                get() {
                    return clearAxios
                }
            }

        })
        // 添加token
    if (store.state.user.user.token) {
        addToken(http, store.state.user.user.token)
        addToken(userAxios, store.state.user.user.token)
    }
    // 拦截错误响应
    interceptor(http)
    interceptor(userAxios)
        // 用户的拦截
    userInterceptor(userAxios)
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
}

export default plugin