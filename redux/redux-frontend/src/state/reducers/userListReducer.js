/* eslint-disable indent */
import userService from '../../services/userService'

export const setUsers = () => {
	return async dispatch => {
		const users = await userService.getAll()
		dispatch({
			type: 'SET_USERS',
			users: users
		})
	}
}

const userListReducer = (state = null, action) => {
	switch(action.type) {
		case 'SET_USERS':
			return action.users
		default:
			return state
	}
}

export default userListReducer