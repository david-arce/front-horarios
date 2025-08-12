// src/test/__tests__/ProgramasCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProgramasCRUD from '../../components/Programas/Programas.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

describe('ProgramasCRUD', () => {
  test('crea y edita un programa', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 5, codigo: 'SIS', nombre: 'Sistemas' }] })
    api.post.mockResolvedValueOnce({ data: { id: 6 } })
    api.put.mockResolvedValueOnce({ data: {} })

    render(<ProgramasCRUD />)
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')

    expect(within(tbody).getByRole('cell', { name: 'Sistemas' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'SIS' })).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('Código'), 'IND')
    await userEvent.type(screen.getByPlaceholderText('Nombre'), 'Industrial')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))

    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/programas/',
      expect.objectContaining({ codigo: 'IND', nombre: 'Industrial' })
    )

    const row = within(tbody).getAllByRole('row').find(r => within(r).queryByRole('cell', { name: 'Sistemas' }))
    await userEvent.click(within(row).getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByPlaceholderText('Nombre'))
    await userEvent.type(screen.getByPlaceholderText('Nombre'), 'Sistemas y Computación')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))

    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/programas/5',
      expect.objectContaining({ nombre: 'Sistemas y Computación' })
    )
  })
})
