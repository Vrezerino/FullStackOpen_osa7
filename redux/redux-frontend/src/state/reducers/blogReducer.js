/* eslint-disable indent */
/* eslint-disable no-case-declarations */
import blogService from '../../services/blogService'

export const initializeBlogs = () => {
	return async dispatch => {
		const blogs = await blogService.getAll()
		dispatch({
			type: 'INIT_BLOGS',
			data: blogs
		})
	}
}

export const likeBlog = (id, content) => {
	return async dispatch => {
		await blogService.likeBlog(id, content)
		dispatch({
			type: 'LIKE_BLOG',
			data: { id }
		})
	}
}

export const addBlog = (blog, token) => {
	return async dispatch => {
		const newBlog = await blogService.postNew(blog, token)
		dispatch({
			type: 'ADD_BLOG',
			data: newBlog
		})
	}
}

export const deleteBlog = (id, token) => {
	return async dispatch => {
		await blogService.deleteBlog(id, token)
		dispatch({
			type: 'REMOVE_BLOG',
			data: { id }
		})
	}
}

export const commentBlog = (id, commentObj, token, name) => {
	return async dispatch => {
		const savedComment = await blogService.commentBlog(id, commentObj, token, name)
		dispatch({
			type: 'COMMENT_BLOG',
			id,
			comment: savedComment.toString()
		})
	}
}

const blogReducer = (state = [], action) => {
	switch (action.type) {
		case 'ADD_BLOG':
			return [...state, action.data]
		case 'REMOVE_BLOG':
			return state.flatMap(b => b.id !== action.data.id ? b : [])
		case 'LIKE_BLOG':
			const blogToLike = state.find(b => b.id === action.data.id)
			const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
			return state.map(b => b.id !== action.data.id ? b : likedBlog)
		case 'COMMENT_BLOG':
			const blogToComment = state.find(b => b.id === action.id)
			const commentedBlog = { ...blogToComment, comments: blogToComment.comments.concat(action.comment) }
			return state.map(b => b.id !== action.id ? b : commentedBlog)
		case 'INIT_BLOGS':
			return action.data
		default:
			return state
	}
}

export default blogReducer
