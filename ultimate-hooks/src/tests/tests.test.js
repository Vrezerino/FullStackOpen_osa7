import axios from 'axios'

const baseUrl = 'http://localhost:3005/'

describe('Notes', () => {
	beforeAll(async () => {
		// Delete all notes
		const notes = (await axios.get(baseUrl + 'notes')).data

		for (const note of notes) {
			console.log('note', note)
			await axios.delete(`${baseUrl}notes/${note.id}`)
		}
		
	})
	test('can be added', async () => {
		// Insert two notes
		const notes = (await axios.get(baseUrl + 'notes')).data
		expect(notes).toHaveLength(0)

		await axios.post(baseUrl + 'notes', { content: 'custom-hooks are great', id: 1 })
		await axios.post(baseUrl + 'notes', { content: 'the best feature ever', id: 2 })
		
		const notesAfterPost = (await axios.get(baseUrl + 'notes')).data
		expect(notesAfterPost).toHaveLength(2)
	})
})

describe('People', () => {
	beforeAll(async () => {
		// Delete all people
		const people = (await axios.get(baseUrl + 'people')).data

		for (const person of people) {
			console.log('person', person)
			await axios.delete(`${baseUrl}people/${person.id}`)
		}
		
	})
	test('can be added', async () => {
		// Insert three people
		const people = (await axios.get(baseUrl + 'people')).data
		expect(people).toHaveLength(0)

		await axios.post(baseUrl + 'people', { name: 'mluukkai', number: '040-5483923', id: 1 })
		await axios.post(baseUrl + 'people', { name: 'kaltsoon', number: '045-2323456', id: 2 })
		await axios.post(baseUrl + 'people', { name: 'Patrick', number: '045-2100144', id: 3 })

		const peopleAfterPost = (await axios.get(baseUrl + 'people')).data
		expect(peopleAfterPost).toHaveLength(3)
	})
})