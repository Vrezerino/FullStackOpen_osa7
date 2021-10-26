import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	return {
		type,
		value,
		onChange
	}
}

const useCountry = (name) => {
	const [country, setCountry] = useState(null)

	useEffect(() => {
		const fetchCountry = () => {
			if (name) {
				axios
					.get(`https://restcountries.com/v3.1/name/${name}`)
					.then(r => { 
						setCountry(r.data[0])
					})
					.catch((e) => { 
						console.log(e.response) 
						setCountry(null)
					})
			}
		}
		fetchCountry()
	}, [setCountry, name])

	return country
}

const Country = ({ country }) => {
	return country ? (
		<div>
			<h3>{country.name.common} </h3>
			<div>Capital: <b>{country.capital}</b> </div>
			<div>Population: <b>{new Intl.NumberFormat().format(country.population)}</b></div>
			<img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`} />
		</div>
	) : <div>
		Not found!
	</div>
}

const App = () => {
	const nameInput = useField('text')
	const [name, setName] = useState('')
	const country = useCountry(name)

	const fetch = (e) => {
		e.preventDefault()
		setName(nameInput.value)
	}

	return (
		<div>
			<h1>Find A Country</h1>
			<form onSubmit={fetch}>
				<input {...nameInput} placeholder='Search here'/>
				<button>Find</button>
			</form>

			<Country country={country} />
		</div>
	)
}

export default App
