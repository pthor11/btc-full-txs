import axios from 'axios'
import {btc} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '1.0',
        id: null
    })

    return axios({
        url: btc.url,
        auth: {
            username: btc.username,
            password: btc.password,
        },
        data,
        method: 'post'
    })
}

export default call