import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const baseUrl = `https://api.openweathermap.org/data/3.0`

const getCity = (lat, lon) => {
    const request = axios.get(`${baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`)
    return request.then(response => response.data)
}

export default {getCity}