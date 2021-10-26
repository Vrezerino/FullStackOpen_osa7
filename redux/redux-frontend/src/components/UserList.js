import React from 'react'
import { Link } from 'react-router-dom'

/*
const User = ({ user, blogs }) => {
	return (
		<div>
			<h4>{user.name}</h4>
			<h5>Added blogs:</h5>
			{blogs ? blogs.map(b => <div key={b.id}>{b.title}</div>) : null}
		</div>
	)
}
*/

const UserList = ({ users }) => {
	return (
		<div className='userList'>
			<h4>Users</h4>
			<table>
				<thead>
					<tr>
						<td></td>
						<td>Blogs created</td>
					</tr>
				</thead>
				<tbody>
					{users ? users.map(u =>
						<tr key={u.id}>
							<td>
								<Link to={`/users/${u.id}`}>{u.name}</Link>
							</td>
							<td>
								{u.blogs.length}
							</td>
						</tr>) : null}
				</tbody>
			</table>
		</div>
	)
}

export default UserList