// src/test/__tests__/SedesCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SedesCRUD from '../../components/Sedes/Sedes.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

describe('SedesCRUD', () => {
  test('crea, edita y elimina una sede', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 3, nombre: 'Buga' }] })
    api.post.mockResolvedValueOnce({ data: { id: 4 } })
    api.put.mockResolvedValueOnce({ data: {} })
    api.delete.mockResolvedValueOnce({})
    render(<SedesCRUD />)
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup') // << clave
    expect(within(tbody).getByRole('cell', { name: 'Buga' })).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('Nombre de la Sede'), 'Tuluá')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))

    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/sedes/',
      expect.objectContaining({ nombre: 'Tuluá' })
    )
    // editar la fila 'Buga'
    const row = within(tbody).getAllByRole('row')
      .find(r => within(r).queryByRole('cell', { name: 'Buga' }))
    await userEvent.click(within(row).getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByPlaceholderText('Nombre de la Sede'))
    await userEvent.type(screen.getByPlaceholderText('Nombre de la Sede'), 'Buga Centro')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))
    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/sedes/3',
      expect.objectContaining({ nombre: 'Buga Centro' })
    )
    // eliminar
    await userEvent.click(within(row).getByRole('button', { name: /eliminar/i }))
    expect(api.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/sedes/3')
  })
})
