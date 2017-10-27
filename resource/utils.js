// axios设置
export const urlConfig = {
        'auth/login': '/user/api/v1/',
        'auth/admin_login': '/user/api/v1/',
        'auth/register': '/user/api/v1/',
        'auth/register_global': '/user/api/v1/',
        'auth/register_global_confirm': '/user/api/v1/',
        'auth/register_global_to_confirm': '/user/api/v1/',
        'auth/register_verify_phone': '/user/api/v1/',
        'auth/forgot_password': '/user/api/v1/',
        'auth/verify_token_for_reset_password': '/user/api/v1/',
        'auth/reset_password_with_phone': '/user/api/v1/',
        'auth/verify_token_for_mail_reset_password': '/user/api/v1/',
        'auth/reset_password_with_mail': '/user/api/v1/',
        'roles': '/user/api/v1/',
        'permissions': '/user/api/v1/',
        'users': '/user/api/v1/',
        'users/info': '/user/api/v1/',
        'users/new_phone': '/user/api/v1/',
        'users/verify_new_phone': '/user/api/v1/',
        'users/password': '/user/api/v1/'
    }
    // 通用拦截器
export const interceptor = function(axios) {
        //添加一个请求拦截器
        axios.interceptors.request.use(config => {
                //在请求发出之前进行添加_loading字段
                if (config.data) {
                    config.data._loading = false
                }
                return config
            }, err => {
                return Promise.reject(err)
            })
            // 添加一个响应拦截器
        axios.interceptors.response.use(
            response => {
                //在响应之后进行添加_loading字段
                if (_.isObject(response.data)) response.data._loading = true
                if (response.data !== 'OK') {
                    if (!isJSON(response.data, true)) {
                        throw new Error(`The data returned is not json!The wrong location(url:${response.config.url})`)
                    }
                }
                return response
            }, error => {
                //在响应错误的时候进行添加_loading字段
                error.response._loading = true
                    //响应错误处理
                if (error.response && error.response.status === 401) {
                    // 如果已经位于登陆那就不跳啦
                    if (location.pathname === '/login') return
                    location.href = "/login"
                }
                return Promise.reject(error)
            })
    }
    //  user的拦截器
export const userInterceptor = function(multivariate) {
        //添加一个请求拦截器
        multivariate.interceptors.request.use(config => {
                return config
            }, err => {
                return Promise.reject(err)
            })
            // 添加一个响应拦截器
        multivariate.interceptors.response.use(
            response => {
                return response
            }, error => {
                return Promise.reject(error)
            })
    }
    // 添加token https://github.com/mzabriskie/axios/issues/385  axios存在实例间的共享bug
export const addToken = function(http, token) {
    const headers = _.cloneDeep(http.defaults.headers)
    headers.common.authorization = token
    http.defaults.headers = headers
}

// 实例update方法
export const addFunc = function(item, http) {
        let $update = () => {
            return http.put(`${this.url}/${item[this.id]}`, item).then(res => res.data)
        }
        let $patch = () => {
            return http.patch(`${this.url}/${item[this.id]}`, item).then(res => res.data)
        }
        let $delete = () => {
            return http.delete(`${this.url}/${item[this.id]}`)
        }
        Object.setPrototypeOf(item, {
            $update,
            $patch,
            $delete
        })
    }
    //继承的静态的方法没有前缀的url(query,get,post,put,patch,delete)
export const urlMap = {
        'cart/my_products': 'sku',
        'product/detail': 'sku',
        'products': 'sku',
        'cases': 'sku',
        'collections': 'sku'
    }
    // 公共的实例的有前缀的url($save,$update,$delete)
export const urlMapOne = {
        '/web/api/v1/cart/my_products': 'sku',
        '/web/api/v1/product/detail': 'sku',
        '/web/api/v1/products': 'sku',
        '/web/api/v1/cases': 'sku',
        '/web/api/v1/collections': 'sku'
    }
    // 判断后台返回的数据的json格式是否正确
function isJSON(str, pass_object) {
    if (pass_object && _.isObject(str)) return true
    if (!_.isString(str)) return false

    str = str.replace(/\s/g, '').replace(/\n|\r/, '')

    if (/^\{(.*?)\}$/.test(str))
        return /"(.*?)":(.*?)/g.test(str)

    if (/^\[(.*?)\]$/.test(str)) {
        return str.replace(/^\[/, '')
            .replace(/\]$/, '')
            .replace(/},{/g, '}\n{')
            .split(/\n/)
            .map(function(s) { return isJSON(s) })
            .reduce(function(prev, curr) { return !!curr })
    }
    return false
}