import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const blog = {
  title: 'this is a test',
  author: 'test author',
  url: 'not really necessary',
  likes: 69,
  user: '7asd785874asd9576asd'
}

describe('<BlogForm />', () => {
  let addBlog
  let container

  beforeEach(() => {
    addBlog = vi.fn()
    container = render(<BlogForm addBlog={addBlog} />).container
  })

  test("blog creation receives correct details when called", async () => {
    const user = userEvent.setup()
    const button = screen.getByText('create')
    const titleInput = container.querySelector('#Title')
    const authorInput = container.querySelector('#Author')
    const urlInput = container.querySelector('#Url')

    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)

    await user.click(button)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('this is a test')
    expect(addBlog.mock.calls[0][0].author).toBe('test author')
    expect(addBlog.mock.calls[0][0].url).toBe('not really necessary')
    expect(addBlog.mock.calls[0][0].likes).toBe(0)
  })
})
