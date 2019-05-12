export const checkBrowserType = () => {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('MSIE') != -1) {
        return 'ie'
    } else if (userAgent.indexOf('Trident') != -1) {
        return 'ie'
    } else if (userAgent.indexOf('Edge') != -1) {
        return 'edge'
    } else {
        return 'etc'
    }
}