// Nuolifunktiot näyttävät toimivan joten mennään niillä

describe('Blog app', () => {
	beforeEach(() => {
		cy.request('POST', 'http://localhost:3001/api/testing/reset')

		const user = {
			name: 'Tester',
			username: 'tester',
			password: 'testpassword'
		}

		cy.request('POST', 'http://localhost:3001/api/register', user)
		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', () => {
		cy.contains('Log in or register!')
		cy.get('#username').should('exist')
		cy.get('#password').should('exist')
	})

	describe('Login', () => {
		it('is successful with correct credentials', () => {
			cy.login({ username: 'tester', password: 'testpassword' })
			cy.contains('Interesting blogs')
		})

		it('fails with wrong credentials', () => {
			cy.get('#username').type('tester')
			cy.get('#password').type('wrong')
			cy.get('button').click()

			cy.contains('Invalid username or password!')
		})
	})

	describe('When logged in', () => {
		beforeEach(() => {
			cy.login({ username: 'tester', password: 'testpassword' })
		})

		it('a blog can be created', () => {
			cy.get('#toggleForm').click()
			cy.get('#author').type('Tester')
			cy.get('#title').type('Test title')
			cy.get('#url').type('www.test453845934.com')
			cy.get('#postBtn').click()
			cy.contains('Test title by Tester')
		})

		it('a blog can be liked after creation', () => {
			cy.createBlog({ title: 'Test title'})
			cy.get('#viewBlog').click()
			cy.contains('Likes: 0')
			cy.get('#likeBtn').click()
			cy.contains('Likes: 1')
		})

		it('a blog can be removed by its poster', () => {
			cy.createBlog({ title: 'Test title'})
			cy.get('#viewBlog').click()
			cy.get('#deleteBlog').click()
			cy.get('html').should('not.contain', 'Title: Test title')
		})

		it('a blog can not be removed by any other than its poster', () => {
			cy.createBlog({ title: 'Test title'})
			cy.get('#logoutBtn').click()

			cy.register({ username: 'tester2', password: 'testpassword2', name: 'Tester2' })

			cy.get('#viewBlog').click()
			cy.get('#deleteBlog').should('not.exist')
		})

		it('the blogs are sorted by descending order of likes', () => {
			cy.createBlog({ title: 'Test 1'})
			cy.createBlog({ title: 'Test 2'})
			cy.createBlog({ title: 'Test 3'})

			// parent: <b>, grandparent: actual <div>
			cy.contains('Test 1').parent().parent().find('button').click()
			cy.get('#likeBtn').click()
			cy.get('#closeBlog').click()

			cy.contains('Test 2').parent().parent().find('button').click()
			cy.get('#likeBtn').click()
			cy.wait(200)
			cy.get('#likeBtn').click()
			cy.get('#closeBlog').click()

			cy.contains('Test 3').parent().parent().find('button').click()
			cy.get('#likeBtn').click()
			cy.wait(200)
			cy.get('#likeBtn').click()
			cy.wait(200)
			cy.get('#likeBtn').click()
			cy.get('#closeBlog').click()

			cy.visit('http://localhost:3000')

			// Only titles are boldened so it's convenient to wrap <b> tags
			cy.get('b').then(titles => {
				cy.wrap(titles).its(0).should('contain', 'Test 3')
			})

			cy.get('b').then(titles => {
				cy.wrap(titles).its(1).should('contain', 'Test 2')
			})

			cy.get('b').then(titles => {
				cy.wrap(titles).its(2).should('contain', 'Test 1')
			})
		})
	})
})