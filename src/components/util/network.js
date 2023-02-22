import axios from "axios"
import isDebug from "@/components/config";

export default class Net {

    static init() {
        axios.defaults.baseURL = this.baseUrl()
        let headers = this.defaultHeaders()
        for (let key in headers) {
            axios.defaults.headers.common[key] = headers[key]
        }
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

    static get(url, data) {
        let request_string = ""
        for (let key in data) {
            request_string += `${key}=${data[key]}&`
        }
        request_string = request_string.substring(
            0, request_string.length - 1)

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
