// src/test/__tests__/DocentesCRUD.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DocentesCRUD from '../../components/Docentes/Docentes.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

describe('DocentesCRUD', () => {
  test('lista docentes y permite crear y editar', async () => {
    // Carga inicial
    api.get.mockResolvedValueOnce({ data: [
      { id: 1, cc: '100', nombres: 'Linus', apellidos: 'Torvalds', email: 'l@x.com', telefono: '123' }
    ]})
    api.post.mockResolvedValueOnce({ data: { id: 2 } })
    api.put.mockResolvedValueOnce({ data: {} })

    render(<DocentesCRUD />)
    expect(await screen.findByText('Linus')).toBeInTheDocument()
    // Crear
    await userEvent.type(screen.getByPlaceholderText('CC'), '101')
    await userEvent.type(screen.getByPlaceholderText('Nombres'), 'Barbara')
    await userEvent.type(screen.getByPlaceholderText('Apellidos'), 'Liskov')
    await userEvent.type(screen.getByPlaceholderText('Email'), 'b@x.com')
    await userEvent.type(screen.getByPlaceholderText('Teléfono'), '555')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))
    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/docentes/',
      expect.objectContaining({ cc: '101', nombres: 'Barbara', apellidos: 'Liskov', email: 'b@x.com', telefono: '555' })
    )

    // Editar el existente
    await userEvent.click(screen.getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByPlaceholderText('Nombres'))
    await userEvent.type(screen.getByPlaceholderText('Nombres'), 'Linus B.')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))

    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/docentes/1',
      expect.objectContaining({ nombres: 'Linus B.' })
    )
  })
})
