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

  test('login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login '}).click()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'teste', 'senha124')
      await expect(page.getByText('teste logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'teste', 'senha123')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'teste', 'senha124')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'new test blog', 'teste user', 'google.com')
      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('a new blog new test blog by teste user added')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(page.getByText('Title: new test blog | Author: teste user')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'new test blog', 'teste user', 'google.com')
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user can delete a blog', async ({ page }) => {
      await createBlog(page, 'new test blog', 'teste user', 'google.com')
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByRole('button', { name: 'remove' }).first()).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).first().click()
    })

    test('different user cannot see remove button', async ({ page, request }) => {
      await createBlog(page, 'new test blog', 'teste user', 'google.com')
      await page.getByRole('button', { name: 'logout'}).click()
      await request.post('/api/users', {
        data: {
          name: 'teste2',
          username: 'teste2',
          password: 'senha124'
        }
      })
      await loginWith(page, 'teste2', 'senha124')
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByRole('button', { name: 'remove' }).first()).not.toBeVisible()
    })

    test.only('blogs are sorted by like amount', async ({ page }) => {
      await createBlog(page, 'first blog', 'teste user', 'google.com')
      await createBlog(page, 'second blog', 'teste user', 'google.com')
      await createBlog(page, 'third blog', 'teste user', 'google.com')
      await createBlog(page, 'fourth blog', 'teste user', 'google.com')
      await page.waitForFunction(() => document.querySelectorAll('.blogDiv').length === 4);
      const blogContainers = page.locator('.blogDiv')
      const num_blogs = await blogContainers.count()
      for (let i = 0; i < num_blogs; ++i){
        const blog = await blogContainers.nth(i)
        await blog.getByRole('button', { name: 'view' }).click()
      }
      for (let i = 0; i < 14; ++i){
        await page.getByRole('button', { name: 'like'}).nth(num_blogs-2).click()
      }
      const likes = []
      for (let i = 0; i < num_blogs; ++i){
        const blog = await blogContainers.nth(i)
        let text = await blog.getByText('likes').textContent()
        likes.push(parseInt(text.match(/\d+/)?.[0]))
      }
      expect(likes.every((val, i, arr) => i === 0 || arr[i - 1] >= val)).toBeTruthy()
    })
  })
})
