import React, { useRef } from 'react'
import { setNotif } from '../state/reducers/notifReducer'
import { login, register } from '../state/reducers/userReducer'
import { useDispatch } from 'react-redux'
import './LoginForm.css'

const LoginForm = notif => {
	const dispatch = useDispatch()
	const nameInputRef = useRef()

	const toggleNameField = event => {
		if (event.target.checked) {
			nameInputRef.current.style = 'visibility: visible'
		} else {
			nameInputRef.current.style = 'visibility: hidden'
		}
	}

	const handleLogin = async event => {
		event.preventDefault()
		// Register
		if (event.target.register.checked) {
			try {
				await dispatch(
					register({
						name: event.target.name.value,
						username: event.target.username.value,
						password: event.target.password.value
					})
				)
			} catch (e) {
				if (e.message.includes('400')) {
					dispatch(setNotif(e.response.data.error.split(':')[2]))
				} else {
					dispatch(setNotif('Server or connection error!'))
				}
			}
		} else {
			// Login
			try {
				await dispatch(
					login({
						username: event.target.username.value,
						password: event.target.password.value
					})
				)
			} catch (e) {
				if (e.message.includes('401')) {
					dispatch(setNotif('Invalid username or password!'))
				} else {
					dispatch(setNotif('Server or connection error!'))
				}
			}
		}
	}
	return (
		<div className='loginForm'>
			<form onSubmit={handleLogin}>
				<table>
					<thead>
						<tr>
							<td>
								<h1>{notif.notif || 'Log in or register!'}</h1>
							</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<input hidden
									type='text'
									placeholder='Username'
									autoComplete='username'
									readOnly />
							</td>
						</tr>
						<tr>
							<td>
								<input type='username'
									id='username'
									placeholder='Username'
									autoComplete='username'
									name='username' />
							</td>
						</tr>
						<tr>
							<td>
								<input type='password'
									id='password'
									placeholder='Password'
									autoComplete='new-password'
									name='password' />
							</td>
						</tr>
						<tr>
							<td>
								<input ref={nameInputRef}
									type='name'
									id='name'
									placeholder='Name'
									autoComplete='name'
									name='name'
									style={{ visibility: 'hidden' }}/>
							</td>
						</tr>
						<tr>
							<td>
								<input type='checkbox'
									id='register'
									name='register'
									onChange={toggleNameField} />Register account
							</td>
						</tr>
						<tr>
							<td>
								<button type='submit'>Go!</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	)
}

export default LoginForm