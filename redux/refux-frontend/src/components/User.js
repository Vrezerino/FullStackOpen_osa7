import React from 'react'

const User = ({ user }) => {
	console.log(user.blogs)
	return user ? (
		<div className='user'>
			<h4>{user.name}</h4>
			<h5>Added blogs:</h5>
			{user.blogs.map(b => <div key={b.id}><i>{b.title}</i></div>)}
		</div>
	) : null
}

export default User