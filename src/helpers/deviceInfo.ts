export const getDeviceInfo = () => {
    return `${navigator.userAgent}&${navigator.language}&${Date.now()}`
}