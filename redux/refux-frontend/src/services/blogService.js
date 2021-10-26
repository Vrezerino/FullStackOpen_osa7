import axios from 'axios'

const baseUrl = '/api/blogs'

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

const postNew = async (newBlog, token) => {
	const response = await axios.post(baseUrl, newBlog, { headers: { Authorization: token } })
	return response.data
}

const deleteBlog = async (id, token) => {
	const response = await axios.delete(baseUrl + '/' + id, { headers: { Authorization: token } })
	return response.data
}
const likeBlog = async (id, content) => {
	const response = await axios.put(`${baseUrl}/${id}`, content)
	return response.data
}

const commentBlog = async (id, comment, token, name) => {
	const response = await axios.post(`${baseUrl}/${id}/comments`, { comment, name }, { headers: { Authorization: token } })
	return response.data
}

const exports = { getAll, postNew, deleteBlog, likeBlog, commentBlog }
export default exports