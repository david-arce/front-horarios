import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../../components/Auth/LoginForm.jsx'
import { renderWithRouter } from '../utils.jsx'
// mock del servicio real
vi.mock('../../services/authService', () => ({
  login: vi.fn(() => Promise.resolve({ access_token: 'fake' }))
}))
import { login } from '../../services/authService'
// mock de useNavigate para asertar la redirección
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})
describe('LoginForm', () => {
  test('envía credenciales y navega al dashboard en éxito', async () => {
    renderWithRouter(<LoginForm />, { route: '/auth/login' })
    await userEvent.type(screen.getByLabelText(/usuario/i), 'demo')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(login).toHaveBeenCalledWith('demo', 'secret')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })
  test('muestra mensaje de error cuando falla el login', async () => {
    login.mockRejectedValueOnce(new Error('bad creds'))
    renderWithRouter(<LoginForm />, { route: '/auth/login' })
    await userEvent.type(screen.getByLabelText(/usuario/i), 'x')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'y')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
