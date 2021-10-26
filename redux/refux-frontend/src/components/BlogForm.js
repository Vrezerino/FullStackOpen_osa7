import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import './BlogForm.css'
import PropTypes from 'prop-types'

const BlogForm = forwardRef((props, ref) => {
	const notif = useSelector(({ notification }) => {
		return notification
	})

	const [author, setAuthor] = useState('')
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [formOpened, setFormOpened] = useState(false)

	const resetFields = () => {
		setAuthor('')
		setTitle('')
		setUrl('')
	}

	useImperativeHandle(ref, () => {
		return {
			setFormOpened,
			resetFields
		}
	})

	const addBlog = (event) => {
		event.preventDefault()
		const newBlog = {
			author: author,
			title: title,
			url: url !== ''
				? ((url.includes('http://' || 'https://')) ? url : 'http://' + url)
				: null,
			user: props.userID
		}

		props.postBlog(newBlog, props.token)
	}

	BlogForm.propTypes = {
		userID: PropTypes.string.isRequired,
		token: PropTypes.string.isRequired,
		postBlog: PropTypes.func.isRequired
	}

	if (formOpened) {
		return (
			<>
				<button className='toggleForm' onClick={() => setFormOpened(false)}>Close form</button>
				<form onSubmit={addBlog} className='blogForm'>
					<table>
						<thead>
							<tr>
								<td>
									{notif}
								</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<input id='author'
										type='text'
										value={author}
										placeholder='Author'
										onChange={({ target }) =>
											setAuthor(target.value)} />
								</td>
							</tr>
							<tr>
								<td>
									<input id='title'
										type='text'
										value={title}
										placeholder='Title'
										onChange={({ target }) =>
											setTitle(target.value)} />
								</td>
							</tr>
							<tr>
								<td>
									<input id='url'
										type='text'
										value={url}
										placeholder='URL'
										onChange={({ target }) =>
											setUrl(target.value)} />
								</td>
							</tr>
							<tr>
								<td>
									<button id='postBtn' type='submit'>Post!</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</>
		)
	} else {
		return (
			<button id='toggleForm' className='toggleForm' onClick={() => setFormOpened(true)}>Post new blog</button>
		)
	}
})

BlogForm.displayName = 'BlogForm'

export default BlogForm