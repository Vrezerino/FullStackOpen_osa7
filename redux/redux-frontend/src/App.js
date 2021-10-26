import React, { useEffect, useRef } from 'react'

import Menu from './components/Menu'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import User from './components/User'
import UserList from './components/UserList'

import { initializeBlogs, addBlog } from './state/reducers/blogReducer'
import { setUsers } from './state/reducers/userListReducer'
import { setNotif } from './state/reducers/notifReducer'
import { logout } from './state/reducers/userReducer'
import { removeToken } from './state/reducers/tokenReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
	Switch,
	Route,
	useRouteMatch
} from 'react-router-dom'

const App = () => {
	const dispatch = useDispatch()
	const loggedInUser = useSelector(({ user }) => user)
	const token = useSelector(({ token }) => token)
	const notif = useSelector(({ notification }) => notification)

	const blogFormRef = useRef()

	useEffect(() => {
		dispatch(initializeBlogs())
		dispatch(setUsers())
	}, [])

	const blogs = useSelector(({ blogs }) => (
		blogs.sort((b1, b2) => b2.likes - b1.likes))
	)
	const users = useSelector(({ users }) => users)

	const logOut = () => {
		dispatch(logout())
		dispatch(removeToken())
	}

	const postBlog = async (newBlog, token) => {
		try {
			await dispatch(addBlog(newBlog, token))
			await dispatch(setUsers())
			blogFormRef.current.resetFields()
			blogFormRef.current.setFormOpened(false)
		} catch (e) {
			if (e.message.includes('400')) {
				dispatch(setNotif('No badwords or empty fields.'))
			} else {
				dispatch(setNotif('Token expired or server error!'))
			}
		}
	}

	const match = useRouteMatch('/users/:id')
	const user = match
		? users.find(u => u.id === match.params.id)
		: null

	if (loggedInUser) {
		return (
			<div className='container'>
				<Menu />
				<section>
					<h2>Interesting blogs</h2>

					<Switch>
						<Route path='/users/:id'>
							<User
								user={user}
								blogs={blogs} />
						</Route>
						<Route path='/users'>
							<UserList users={users} />
						</Route>
						<Route path='/'>
							<BlogList
								blogs={blogs}
								token={token}
								user={loggedInUser}
								notif={notif} />
							<BlogForm ref={blogFormRef}
								postBlog={postBlog}
								blogs={blogs}
								userID={loggedInUser.id}
								token={token} />
						</Route>
					</Switch>

					<hr />

					<div className='currentUser'>
						~ {loggedInUser.username} ({loggedInUser.name}) logged in ~
					</div>
					<button type='button'
						id='logoutBtn'
						className='logoutBtn'
						onClick={logOut}>Log Out</button>
				</section>
			</div>
		)
	} else {
		return (
			<div className='container'>
				<section>
					<LoginForm notif={notif}/>
				</section>
			</div>
		)
	}
}

export default App