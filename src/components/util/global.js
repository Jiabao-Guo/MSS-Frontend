import {ref} from "vue";
import {createGlobalState, useDark} from "@vueuse/core";
import {StorageKey} from "@/components/util/storage";

export function useSetDarkMode() {
    return function (dark) {
        ref(useDark()).value = !!dark
        localStorage.setItem(StorageKey.dark_mode, dark ? '1' : '0')
    }
}

export function useToggleDarkMode() {
    return function () {
        let current = ref(useDark()).value
        ref(useDark()).value = !current
        localStorage.setItem(StorageKey.dark_mode, !current ? '1' : '0')
    }
}

export function useInitForDarkMode() {
    return function () {
        let dark = localStorage.getItem(StorageKey.dark_mode)
        ref(useDark()).value = dark === '1'
    }
}

export function useDefaultElMessageBoxConfig() {
    return {
        draggable: true,
        autofocus: true,
        customStyle: {
            borderRadius: '12px',
            padding: '12px',
        },
    }
}

export function useTasks() {
    function setTasks(uuids) {
        localStorage.setItem("tasks", uuids.join(","))
    }

    function getTasks() {
        let ret = localStorage.getItem("tasks")
        if (!ret) {
            return []
        }
        return ret.split(",")
    }

    function addTask(uuid) {
        let uuids = getTasks()
        uuids.push(uuid)
        setTasks(uuids)
    }

    function removeTask(uuid) {
        let uuids = getTasks()
        uuids.splice(uuids.indexOf(uuid), 1)
        setTasks(uuids)
    }

    return {
        getTasks, addTask, removeTask
    }
}

export function useDefaultConfig() {
    return {
        minLoadingTimeMillis: 500,
        taskRefreshRateMillis: 1000,
    }
}


const tokenExpiry = createGlobalState(() => ref(false))
const permissionDeniedCounter = createGlobalState(() => ref(0))

export function useTokenExpiry() {
    return tokenExpiry()
}

export function usePermissionDeniedCounter() {
    return permissionDeniedCounter()
}
