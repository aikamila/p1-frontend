export const getItemAndCheckExpiry = (key) => {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }
    return item.value
}


export const setItemwith8MonthExpiry = (key, value) => {
    const now = new Date()
    const item = {
        value: value,
        expiry: Date.now() + 1000 * 60 * 60 * 24 * 30 * 8,
    }
    localStorage.setItem(key, JSON.stringify(item))
}
