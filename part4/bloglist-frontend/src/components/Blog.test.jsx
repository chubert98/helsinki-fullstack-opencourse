import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'this is a test',
  author: 'test author',
  url: 'not really necessary',
  likes: 69,
  user: '7asd785874asd9576asd'
}

describe('<Blog />', () => {
  let container
  let addLike

  beforeEach(() => {
    addLike = vi.fn()
    container = render(<Blog blog={blog} addLike={addLike} />).container
  })

  test("renders blog's title and author", async () => {
    const element = await screen.getByText(blog.title, { exact: false })

    const div = container.querySelector('.detailsDiv')

    expect(element).toBeDefined()
    expect(div).toHaveStyle('display:none')
  })

  test('displays url and likes after click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.detailsDiv')

    expect(div).toHaveStyle('display:block')
  })

  test('like button has been clicked twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    screen.debug()

    expect(addLike.mock.calls).toHaveLength(2)
  })
})
