import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import blogReducer from './reducers/blogReducer'
import thunk from 'redux-thunk'
import notifReducer from './reducers/notifReducer'
import userReducer from './reducers/userReducer'
import userListReducer from './reducers/userListReducer'
import tokenReducer from './reducers/tokenReducer'

const reducer = combineReducers({
	blogs: blogReducer,
	notification: notifReducer,
	user: userReducer,
	users: userListReducer,
	token: tokenReducer
})

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
export default store