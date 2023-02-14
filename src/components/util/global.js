import {ref} from "vue";
import {useDark} from "@vueuse/core";

export function useGlobalSetDarkMode() {
    return function(dark) {
        ref(useDark()).value = !!dark
        localStorage.setItem('dark', dark ? 'true' : 'false')
    }
}

export function useGlobalToggleDarkMode() {
    return function() {
        let current = ref(useDark()).value
        ref(useDark()).value = !current
        localStorage.setItem('dark', !current ? 'true' : 'false')
    }
}

export function useGlobalInitForDarkMode() {
    return function() {
        let dark = localStorage.getItem('dark')
        ref(useDark()).value = dark === 'true'
    }
}
