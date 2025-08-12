vi.mock('axios', () => ({ default: { post: vi.fn() } }))
import axios from 'axios'
import { login, register } from '../../services/authService'

describe('authService', () => {
  test('login retorna token', async () => {
    axios.post.mockResolvedValueOnce({ data: { access_token: 't0k3n' } })
    const data = await login('demo', 'secret')
    expect(axios.post).toHaveBeenCalled()
    expect(data.access_token).toBe('t0k3n')
  })

  test('register retorna id', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 7 } })
    const resp = await register('u', 'e@e.com', 'p', 'docente')
    expect(axios.post).toHaveBeenCalled()
    expect(resp.data.id).toBe(7)   
  })
})
