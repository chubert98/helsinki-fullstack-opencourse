const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog List app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'teste',
        username: 'teste',
        password: 'senha124'
      }
    })

    await page.goto('')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs')
    await expect(locator).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()

    await page.getByTestId('Username').fill('teste')
    await page.getByTestId('Password').fill('senha124')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('teste logged-in')).toBeVisible()
  })

})
