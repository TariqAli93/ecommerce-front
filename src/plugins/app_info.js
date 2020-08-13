import axios from 'axios';
import serverPath from './ServerSidePath';

const API = new serverPath().API;

export let app_info = axios.get(API + '/settings')
.then(data => {
    return data.data;
}).catch(err => {
    console.error(err)
});