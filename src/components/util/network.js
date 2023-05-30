import axios from "axios"
import isDebug from "@/components/config";
import md5 from "js-md5";
import {sha256} from "js-sha256";
import {timestamp} from "@vueuse/core";
import {usePermissionDeniedCounter, useTokenExpiry} from "@/components/util/global";

export default class Net {

    static init() {
        axios.defaults.baseURL = this.baseUrl()
        let headers = this.defaultHeaders()
        for (let key in headers) {
            axios.defaults.headers.common[key] = headers[key]
        }
    }

    static timestampToSalt() {
        return `${Math.floor(Date.now() / 1000 / 10)}`
    }

    static saltForLogin(passwordSha256Sha256, number) {
        return sha256(
            passwordSha256Sha256
            + this.timestampToSalt()
            + `${number}`
        )
    }

    static baseUrl() {
        return isDebug()
            ? 'http://localhost:8080/api/v1'
            : 'https://mss-api.jiabao.world/api/v1'
    }

    static defaultHeaders() {
        let token = localStorage.getItem('token')
        if (token) {
            return {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
        return {}
    }

    static requestProxy(method, url, data) {
        const map = {
            'get': axios.get,
            'post': axios.post,
            'put': axios.put,
            'delete': axios.delete,
        }

        const actions = {
            200: () => {
                console.log(`${method.toUpperCase()} ${url} (${data}) success`)
            },
            401: () => {
                const expiry = useTokenExpiry()
                expiry.value = true
                console.log(`Token expired, redirecting to login page`)
            },
            403: () => {
                const permissionDenied = usePermissionDeniedCounter()
                permissionDenied.value += 1
                console.log(`Permission denied`)
            },
        }

        const future = map[method.toLowerCase()](url, data)
        return future.catch(error => {
            const proc = actions[error.response.status]
            proc && proc()
        })
    }

    static get(url, data) {
        let request_string = ""
        for (let key in data) {
            request_string += `${key}=${data[key]}&`
        }
        request_string = request_string.substring(
            0, request_string.length - 1)

        // let salt = sha256(this.saltFactor() + request_string)
        // request_string += `&salt=${salt}`

        console.log(`GET ${url}?${request_string}`)
        return this.requestProxy('get', `${url}?${request_string}`, null)
    }

    static post(url, data) {
        console.log(`POST ${url} (${data})`)
        return this.requestProxy('post', url, data)
    }

    static put(url, data) {
        console.log(`PUT ${url} (${data})`)
        return this.requestProxy('put', url, data)
    }

    static delete(url, data) {
        console.log(`DELETE ${url} (${data})`)
        return this.requestProxy('delete', url, data)
    }
}
