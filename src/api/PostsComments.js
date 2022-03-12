import axios from 'axios';

export default axios.create({
    baseURL: 'https://arcane-spire-03245.herokuapp.com/api/services/posts'
})