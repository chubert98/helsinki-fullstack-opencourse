const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login '}).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note'}).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save'}).click()
  await page.getByText(content).waitFor()
}

const createBlog = async (page, title, author, url) => {
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/blogs') && response.status() === 201
  );
  await page.getByRole('button', { name: 'new blog'}).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create'}).click()
  await responsePromise
}

export { loginWith, createNote, createBlog }
