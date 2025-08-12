// src/test/__tests__/PeriodosCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PeriodosCRUD from '../../components/Periodos/Periodos.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

describe('PeriodosCRUD', () => {
  test('crea y actualiza un periodo', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 1, nombre: '2024-2' }] })
    api.post.mockResolvedValueOnce({ data: { id: 2 } })
    api.put.mockResolvedValueOnce({ data: {} })
    render(<PeriodosCRUD />)
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')

    expect(within(tbody).getByRole('cell', { name: '2024-2' })).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Nombre'), '2025-1')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))
    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/periodos/',
      expect.objectContaining({ nombre: '2025-1' })
    )

    const row = within(tbody).getAllByRole('row').find(r => within(r).queryByRole('cell', { name: '2024-2' }))
    await userEvent.click(within(row).getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByPlaceholderText('Nombre'))
    await userEvent.type(screen.getByPlaceholderText('Nombre'), '2024-2B')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))

    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/periodos/1',
      expect.objectContaining({ nombre: '2024-2B' })
    )
  })
})
