import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, user, token, notif }) => {
	return (
		<div>
			{blogs.map(blog =>
				<Blog key={blog.id}
					blog={blog}
					blogs={blogs}
					user={user}
					token={token}
					notif={notif} />
			)}
		</div>
	)
}

export default BlogList