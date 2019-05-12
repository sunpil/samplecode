import axios from 'axios';
import {
    SmartMessageBox
} from "../../components/utils/actions/MessageActions";

const instance = axios.create({
   headers: {
    'Pragma' : 'no-cache'
   }
});
    
const API = () => {
    return instance;
}
var isShowing = false;

export function initAxios(history) {
    instance.interceptors.request.use((config)=> {
        const pattern = /(\/\#\/)(([a-zA-Z0-9]+(-[a-zA-Z0-9]+)?)\/?){1,}[a-z0-9]+(\?page_tab=[0-9])?/
        config.headers['url'] = document.location.href.match(pattern) !== null ?
            document.location.href.match(pattern)[0].substring(2) : '/'
        return config;
    }, (error) => {
        return Promise.reject(error)
    });
    instance.interceptors.response.use(
        (response) => {
            return {
                ...response,
                history
            };
        },
        (error) => {
            if (!isShowing) {
                isShowing = true;
                let message = null;
                if (error.response.data.message)
                    message = error.response.data.message;
                SmartMessageBox({
                    title: "<i class='fa fa-ban' style='color:red'></i> 오류",
                    content: message !== null ? message : error.message,
                    buttons: '[Ok]'
                }, (ButtonPressed) => {
                    isShowing = false;
                    if (ButtonPressed == 'Ok')
                        if (error.response.status == 401)
                            history.push('/login');
                });
            }
            return Promise.reject(error);
        });
}

export default API;