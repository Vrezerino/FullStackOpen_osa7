import React, { useRef, useState } from 'react'
import { useField } from './hooks'
import {
	Switch,
	Route,
	Link,
	useRouteMatch,
	useHistory
} from 'react-router-dom'

const Menu = () => {
	const padding = {
		paddingRight: 5
	}
	return (
		<div className='menu'>
			<Link to='/anecdotes' style={padding}>Anecdotes • </Link>
			<Link to='/createnew' style={padding}>Create new! • </Link>
			<Link to='/about' style={padding}>About</Link>
		</div>
	)
}

const Notification = ({ content }) => (
	<div className='notif'>
		{content}
	</div>
)

const Anecdote = ({ anecdote }) => (
	<div>
		<h3>&quot;{anecdote.content}&quot;</h3>
		<ul>
			<li>Author: {anecdote.author}</li>
			<li>Info: <a href={anecdote.info}>{anecdote.info}</a></li>
			<li>Votes: {anecdote.votes}</li>
		</ul>
	</div>
)

const AnecdoteList = ({ anecdotes }) => (
	<div>
		<h2>Anecdotes</h2>
		<ul>
			{anecdotes.map(a => <li key={a.id} ><Link to={`/anecdotes/${a.id}`}>{a.content}</Link></li>)}
		</ul>
	</div>
)

const About = () => (
	<div>
		<h2>About anecdote app</h2>
		<p>According to Wikipedia:</p>

		<em>An anecdote is a brief, revealing account of an individual person or an incident.
			Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
			such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
			An anecdote is &quot;a story with a point.&quot;</em>

		<p>Software engineering is full of excellent anecdotes, on this app you can find the best and add more.</p>
	</div>
)

const Footer = () => (
	<footer>
		<small>
			Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.<br />
			See <a href='https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
		</small>
	</footer>
)

const CreateNew = ({ addNew }) => {
	const content = useField('text')
	const author = useField('text')
	const info = useField('text')

	const formRef = useRef()

	const resetFields = (e) => {
		e.preventDefault()
		content.onChange(null)
		author.onChange(null)
		info.onChange(null)
	}

	const history = useHistory()

	const handleSubmit = (e) => {
		e.preventDefault()
		addNew({
			content: content.value,
			author: author.value,
			info: info.value,
			votes: 0
		})
		history.push('/anecdotes')
	}

	return (
		<div>
			<h2>Create a new anecdote!</h2>
			<form onSubmit={handleSubmit} className='anecdoteForm' ref={formRef}>
				<div>
					Content<br />
					<input {...content} />
				</div>
				<div>
					Author<br />
					<input {...author} />
				</div>
				<div>
					URL<br />
					<input {...info} />
				</div>
				<button>Go!</button>
				<button onClick={resetFields}>Reset</button>
			</form>
		</div>
	)
}

const App = () => {
	const [anecdotes, setAnecdotes] = useState([
		{
			content: 'If it hurts, do it more often',
			author: 'Jez Humble',
			info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
			votes: 0,
			id: 1
		},
		{
			content: 'Premature optimization is the root of all evil',
			author: 'Donald Knuth',
			info: 'http://wiki.c2.com/?PrematureOptimization',
			votes: 0,
			id: 2
		}
	])

	const [notification, setNotification] = useState(null)

	let timer
	const addNew = (anecdote) => {
		anecdote.id = Number((Math.random() * 10000).toFixed(0))
		setAnecdotes(anecdotes.concat(anecdote))
		setNotification(`A new anecdote '${anecdote.content}' was created!`)

		clearTimeout(timer)
		setTimeout(() => {
			setNotification(null)
		}, 10000)

	}

	/*
	const anecdoteById = (id) =>
		anecdotes.find(a => a.id === id)

		const vote = (id) => {
		const anecdote = anecdoteById(id)

		const voted = {
			...anecdote,
			votes: anecdote.votes + 1
		}

		setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
	}
	*/

	const match = useRouteMatch('/anecdotes/:id')
	const anecdote = match
		? anecdotes.find(a => a.id === Number(match.params.id))
		: null

	return (
		<div className='container'>
			<h1>Software anecdotes</h1>
			<Menu />
			{notification ? <Notification content={notification} /> : null}
			<Switch>
				<Route path='/anecdotes/:id'>
					<Anecdote anecdote={anecdote} />
				</Route>
				<Route path='/anecdotes'>
					<AnecdoteList anecdotes={anecdotes} />
				</Route>
				<Route path='/createnew'>
					<CreateNew addNew={addNew} />
				</Route>
				<Route path='/about'>
					<About />
				</Route>
			</Switch>
			<Footer />
		</div>
	)
}

export default App