// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', ({ username, password }) => {
	/* 
	cy.request({
		method: 'POST',
		url: 'http://localhost:3001/api/login', 
		body: { username, password },
		failOnStatusCode: false
	}).then(({ body }) => {
		//console.log(body)
		localStorage.setItem('loggedInUser', JSON.stringify(body))
		cy.reload()
	})
	*/

	// Pelkkä POST-pyyntö ei muuta redux storen tilaa joten täytetään kirjautumislomake
	cy.get('#username').type(`${username}`)
	cy.get('#password').type(`${password}`)
	cy.get('button').click()
})

// Rekisteröi ja kirjautuu sen jälkeen sisään samoilla tiedoilla
Cypress.Commands.add('register', ({ username, password, name }) => {
	cy.get('#register').click()
	cy.get('#username').type(`${username}`)
	cy.get('#password').type(`${password}`)
	cy.get('#name').type(`${name}`)
	cy.get('button').click()
})

Cypress.Commands.add('createBlog', ({ title }) => {
	/*
	const blog = {
		author: 'Tester',
		title: title,
		url: 'www.test4edfgert.com'
	}
	cy.request({
		url: 'http://localhost:3001/api/blogs',
		method: 'POST',
		body: blog,
		headers: {
			'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
		}
	})

	cy.visit('http://localhost:3000')
	*/
	cy.get('#toggleForm').click()
	cy.get('form').within(() => {
		cy.get('#author').type('Tester')
		cy.get('#title').type(`${title}`)
		cy.get('#url').type('www.test453845934.com')
		cy.get('#postBtn').click()
	})
})