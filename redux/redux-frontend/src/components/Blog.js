/* eslint-disable no-undef */
import React, { useState } from 'react'
import './Blog.css'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../state/reducers/blogReducer'
import { setNotif } from '../state/reducers/notifReducer'
import { setUsers } from '../state/reducers/userListReducer'

const Blog = ({ blog, user, token, notif }) => {
	const dispatch = useDispatch()
	const loggedUserID = user.id
	const [blogOpened, setBlogOpened] = useState(false)

	const addLike = () => {
		const updatedPost = {
			title: blog.title,
			author: blog.author,
			url: blog.blogUrl,
			likes: blog.likes + 1
		}
		try {
			dispatch(likeBlog(blog.id, updatedPost))
		} catch (e) {
			dispatch(setNotif('Error while voting!'))
		}
	}

	const remove = () => {
		if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
			try {
				dispatch(deleteBlog(blog.id, token))
				dispatch(setUsers())
			} catch (e) {
				dispatch(setNotif('Error while deleting blog!'))
			}
		}
	}

	const comment = async event => {
		event.preventDefault()
		const comment = { comment: event.target.comment.value }
		try {
			await dispatch(commentBlog(blog.id, comment, token, user.name))
			event.target.reset()
		} catch (e) {
			if (e.message.includes('400')) {
				dispatch(setNotif(e.response.data.error.split(':')[2]))
			} else {
				dispatch(setNotif('Server or connection error!'))
			}
		}
	}

	Blog.propTypes = {
		blog: PropTypes.object.isRequired,
		blogs: PropTypes.array.isRequired,
		user: PropTypes.object.isRequired,
		token: PropTypes.string.isRequired
	}

	if (blogOpened) {
		return (
			<div className='blog'>
				<button id='closeBlog' alt='close this blog' onClick={() => setBlogOpened(false)}>Hide</button>
				{loggedUserID === blog.user
					? <button id='deleteBlog' alt='remove this blog' onClick={remove}>X</button>
					: null}
				<ul>
					<div id='title'>Title: <b>{blog.title}</b></div>
					<div id='author'>Author: <b>{blog.author}</b></div>
					<div id='url'>URL: <a href={blog.url}><b>{blog.url}</b></a></div>
					<div id='likes'>Likes: <b>{blog.likes}</b>
						<img id='likeBtn' alt="thumbs up icon" src="thumbsup.png" onClick={addLike} />
					</div>
					<div>Added by <b>{blog.name}</b></div>
				</ul>

				<div className='comments'>
					<b>Comments:</b>
					{blog.comments.map((c, i) => <div key={i}><div>{c}</div><hr /></div>)}
					<form onSubmit={comment}>
						<input placeholder='Type comment' name='comment' type='text' />
					</form>
					<span className='error'>{notif}</span>
				</div>
			</div>
		)
	} else {
		return (
			<div className='blog'>
				<span id='title'><b>{blog.title}</b></span> by <span id='author'>{blog.author}</span>
				<button id='viewBlog' alt='view blog contents' onClick={() => setBlogOpened(true)}>View</button>
			</div>
		)
	}
}

export default Blog