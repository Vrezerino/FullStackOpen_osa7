export const setToken = token => {
	return {
		type: 'SET_TOKEN',
		token: token
	}
}

export const removeToken = () => {
	return {
		type: 'REMOVE_TOKEN'
	}
}

const initialState =
	window.localStorage.getItem('token')

const tokenReducer = (state = initialState, action) => {
	switch(action.type) {
	case 'SET_TOKEN':
		window.localStorage.setItem('token', `bearer ${action.token}`)
		return `bearer ${action.token}`
	case 'REMOVE_TOKEN':
		window.localStorage.removeItem('token')
		return null
	default:
		return state
	}
}

export default tokenReducer