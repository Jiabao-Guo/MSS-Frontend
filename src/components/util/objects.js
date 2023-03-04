export default class ObjectUtil {
    static getNestedProperty(obj, path) {
        return path.split('.').reduce((acc, cur) => acc[cur], obj)
    }

    static setNestedProperty(obj, path, value) {
        let pathArray = path.split('.')
        let lastKey = pathArray.pop()
        let lastObj = pathArray.reduce((acc, cur) => acc[cur], obj)
        lastObj[lastKey] = value
    }
}
