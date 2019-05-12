import API from "../common/API";

export const GET_CONSOLE_CONFIG = "config/GET_CONSOLE_CONFIG";

export const getConsoleConfig = () => (dispatch) => {
    return API().get('/rest/config').then(res => {
        dispatch({
            type: GET_CONSOLE_CONFIG,
            payload: res.data
        });
    });
}