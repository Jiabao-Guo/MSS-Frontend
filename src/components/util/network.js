import axios from "axios"

export default class Net {

    static init() {
        axios.defaults.baseURL = 'http://localhost:8080/'
        axios.defaults.headers.common['X-MSS-Session-Id'] = localStorage.getItem('session')
        axios.defaults.headers.common['X-MSS-Student-Number'] = localStorage.getItem('student_number')
    }

    static get(url, data) {
        let request_string = ""
        for (let key in data) {
            request_string += `${key}=${data[key]}&`
        }
        request_string = request_string.substring(
            0, request_string.length - 1)

        return axios.get(`${url}?${request_string}`)
    }

    static post(url, data) {
        return axios.post(url, data)
    }

    static put(url, data) {
        return axios.put(url, data)
    }

    static delete(url, data) {
        return axios.delete(url, data)
    }
}
