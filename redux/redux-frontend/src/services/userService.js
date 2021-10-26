import axios from 'axios'

const login = async user => {
	const response = await axios.post('/api/login', user)
	return response.data
}
const register = async user => {
	const response = await axios.post('/api/register', user)
	return response.data
}

const getAll = async () => {
	const response = await axios.get('/api/users')
	return response.data
}

const getOne = async id => {
	const response = await axios.get(`/api/users/:${id}`)
	return response.data
}

const exports = { login, register, getAll, getOne }
export default exports