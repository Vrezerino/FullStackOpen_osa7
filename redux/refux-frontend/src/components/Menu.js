import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
	return(
		<div className='nav'>
			~ <Link to ='/'>Blogs</Link> • <Link to ='/users'>Users</Link> ~
		</div>
	)
}

export default Menu