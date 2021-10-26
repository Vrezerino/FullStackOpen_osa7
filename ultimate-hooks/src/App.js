
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		if (event) {
			setValue(event.target.value)
		} else {
			setValue('')
		}
	}

	return {
		type,
		value,
		onChange
	}
}

const useResource = (baseUrl) => {
	const [resources, setResources] = useState([])

	const setData = async () => {
		try {
			const r = await axios.get(baseUrl)
			setResources(r.data)
		} catch {
			console.log('Error')
		}
	}

	useEffect(() => {
		setData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const create = async (resource) => {
		const r = await axios.post(baseUrl, resource)
		setResources(resources.concat(r.data))
	}

	const service = {
		create
	}

	return [
		resources, service
	]
}

const App = () => {
	const content = useField('text')
	const name = useField('text')
	const number = useField('text')

	const [notes, noteService] = useResource('http://localhost:3005/notes')
	const [people, personService] = useResource('http://localhost:3005/people')

	const handleNoteSubmit = (event) => {
		event.preventDefault()
		noteService.create({ content: content.value })
		content.onChange(null)
	}

	const handlePersonSubmit = (event) => {
		event.preventDefault()
		personService.create({ name: name.value, number: number.value })
		name.onChange(null)
		number.onChange(null)
	}

	return (
		<div className='container'>
			<h2>Notes</h2>
			<form onSubmit={handleNoteSubmit}>
				<input {...content} placeholder='Type new note'/>
				<button>Create!</button>
			</form>
			{notes.map(n => <div key={n.id}>{n.id}. <b>{n.content}</b></div>)}

			<h2>People</h2>
			<form onSubmit={handlePersonSubmit}>
				<input {...name} placeholder='Name'/> <br />
				<input {...number} placeholder='Number'/>
				<button>Create!</button>
			</form>
			{people.map(p => <div key={p.id}>{p.id}. <b>{p.name} {p.number}</b></div>)}
		</div>
	)
}

export default App