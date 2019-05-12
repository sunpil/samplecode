import { GET_CONSOLE_CONFIG } from './ConfigurationAction'

const initialState = {
    console: {}
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_CONSOLE_CONFIG:
            return {
                ...state,
                console: action.payload
            }
        default:
            return state
    }
}

export default reducer