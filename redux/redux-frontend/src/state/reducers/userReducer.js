/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import userService from '../../services/userService'
import { setToken } from './tokenReducer'

export const login = user => {
	return async dispatch => {
		const response = await userService.login(user)
		const { token, ...loggedInUser } = response
		dispatch({
			type: 'LOGIN_USER',
			user: loggedInUser
		})
		dispatch(setToken(token))
	}
}

export const logout = () => {
	return {
		type: 'LOGOUT'
	}
}

export const register = user => {
	return async dispatch => {
		await userService.register(user)
		const loginResponse = await userService.login(user)
		const { token, ...loggedInUser } = loginResponse
		dispatch({
			type: 'REGISTER_AND_LOGIN_USER',
			user: loggedInUser
		})
		dispatch(setToken(token))
	}
}

const initialState = JSON.parse(window.localStorage.getItem('user'))

const userReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'LOGIN_USER':
		case 'REGISTER_AND_LOGIN_USER':
			window.localStorage.setItem('user', JSON.stringify(action.user))
			return action.user
		case 'LOGOUT':
			window.localStorage.removeItem('user')
			return null
		default:
			return state
	}
}

export default userReducer