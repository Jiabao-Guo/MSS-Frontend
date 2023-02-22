import {ref} from "vue";
import {useDark} from "@vueuse/core";

export function useSetDarkMode() {
    return function (dark) {
        ref(useDark()).value = !!dark
        localStorage.setItem('dark', dark ? 'true' : 'false')
    }
}

export function useToggleDarkMode() {
    return function () {
        let current = ref(useDark()).value
        ref(useDark()).value = !current
        localStorage.setItem('dark', !current ? 'true' : 'false')
    }
}

export function useInitForDarkMode() {
    return function () {
        let dark = localStorage.getItem('dark')
        ref(useDark()).value = dark === 'true'
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
