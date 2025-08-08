import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '../../components/Auth/RegisterForm.jsx'
import { renderWithRouter } from '../utils.jsx'

vi.mock('../../services/authService', () => ({
  register: vi.fn(() => Promise.resolve({ id: 1 }))
}))
import { register } from '../../services/authService'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

test('registra usuario y redirige al login', async () => {
  renderWithRouter(<RegisterForm />, { route: '/auth/register' })

  await userEvent.type(screen.getByLabelText(/usuario/i), 'nuevo')
  await userEvent.type(screen.getByLabelText(/correo/i), 'nuevo@correo.com')
  await userEvent.type(screen.getByLabelText(/contraseña/i), '123456')
  await userEvent.click(screen.getByRole('button', { name: /registrarse/i }))

  expect(register).toHaveBeenCalledWith('nuevo', 'nuevo@correo.com', '123456')
  expect(mockNavigate).toHaveBeenCalledWith('/login')
})

test('muestra mensaje de error cuando falla el registro (detalle string)', async () => {
  register.mockRejectedValueOnce({ response: { data: { detail: 'El usuario ya existe' } } })
  renderWithRouter(<RegisterForm />)

  await userEvent.type(screen.getByLabelText(/usuario/i), 'existente')
  await userEvent.type(screen.getByLabelText(/correo/i), 'e@e.com')
  await userEvent.type(screen.getByLabelText(/contraseña/i), '123456')
  await userEvent.click(screen.getByRole('button', { name: /registrarse/i }))

  expect(await screen.findByText(/el usuario ya existe/i)).toBeInTheDocument()
  expect(mockNavigate).not.toHaveBeenCalled()
})
