function saveToLocalStorageAsync(key, value) {
    localStorage.setItem(key, value)

    return new Promise((resolve) => {
        let check = () => {
            if (localStorage.getItem(key) == value) {
                resolve(true)
            } else {
                localStorage.setItem(key, value)
                setTimeout(check, 100)
            }
        }
        check()
    })
}

function removeLocalStorageAsync(key) {
    localStorage.removeItem(key)

    return new Promise((resolve) => {
        let check = () => {
            if (!localStorage.getItem(key)) {
                resolve(true)
            } else {
                localStorage.removeItem(key)
                setTimeout(check, 100)
            }
        }
        check()
    })
}

const StorageKey = {
    uid: 'uid',
    token: 'token',
    username: 'username',
    dark_mode: 'dark_mode',
    session_expires_at: 'session_expires_at',
    roles: 'roles',
    privileged: 'privileged',
}

export {
    saveToLocalStorageAsync,
    removeLocalStorageAsync,
    StorageKey,
}
