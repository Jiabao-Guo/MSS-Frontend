import axios from "axios"

export default class Net {
    static init() {
        axios.defaults.baseURL = 'http://localhost:8080/'
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
