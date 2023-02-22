import axios from "axios"
import isDebug from "@/components/config";
import md5 from "js-md5";
import {sha256} from "js-sha256";
import {timestamp} from "@vueuse/core";

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

    static saltForLogin(passwordSha256Sha256, number, isStudentLogin) {
        return sha256(
            passwordSha256Sha256
            + this.timestampToSalt()
            + `${number}`
            + `${isStudentLogin ? 1 : 0}`
        )
    }

    static baseUrl() {
        return isDebug()
            ? 'http://localhost:8080'
            : 'https://mss-api.jiabao.world'
    }

    static defaultHeaders() {
        return {
            'X-MSS-Session-Id': localStorage.getItem('session'),
            'X-MSS-Student-Number': localStorage.getItem('student_number')
        }
    }

    static saltFactor() {
        let factor = localStorage.getItem("salt_factor") || this.baseUrl()
        factor += `${Math.round(timestamp() / 10)}`
        return factor
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
        return axios.get(`${url}?${request_string}`)
    }

    static post(url, data) {
        console.log(`POST ${url} (${data})`)
        return axios.post(url, data)
    }

    static put(url, data) {
        console.log(`PUT ${url} (${data})`)
        return axios.put(url, data)
    }

    static delete(url, data) {
        console.log(`DELETE ${url} (${data})`)
        return axios.delete(url, data)
    }
}
