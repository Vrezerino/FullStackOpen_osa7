/* eslint-disable indent */
let timer
export const setNotif = content => {
	return async dispatch => {
		dispatch({
			type: 'SET_NOTIF',
			notification: content
		})

		clearTimeout(timer)
		timer = setTimeout(() => {
			dispatch({
				type: 'SET_NOTIF',
				notification: null
			})
		}, 3000)
	}
}

const notifReducer = (state = null, action) => {
	switch(action.type) {
		case 'SET_NOTIF':
			return action.notification
		default:
			return state
	}
}

export default notifReducer