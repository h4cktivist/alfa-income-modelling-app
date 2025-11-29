import axios from "axios";

const FIRST_API_URL = '';
const SECOND_API_URL = '';

export const getPosts = axios({url: `${FIRST_API_URL}/posts`, method: 'GET', params: {offset: 0, limit: 10}});