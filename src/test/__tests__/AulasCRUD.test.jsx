// src/test/__tests__/AulasCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AulaCRUD from '../../components/Aulas/Aula.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

function mockCargas() {
  api.get
    .mockResolvedValueOnce({ data: [{ id: 1, nombre: '101', capacidad: 30, tipo: 'general', sede_id: 5 }]})
    .mockResolvedValueOnce({ data: [{ id: 5, nombre: 'Sede Central' }]})
}

describe('AulaCRUD', () => {
  test('lista aulas y mapea nombre de la sede', async () => {
    mockCargas()
    render(<AulaCRUD />)
    // table -> rowgroups [thead, tbody] -> tbody
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    // aserciones SOLO dentro del listado (evita las <option> del form)
    expect(within(tbody).getByRole('cell', { name: '101' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: '30' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'general' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'Sede Central' })).toBeInTheDocument()
  })

  test('crea aula (POST) y actualiza aula (PUT con slash final)', async () => {
    mockCargas()
    api.post.mockResolvedValueOnce({ data: { id: 2 } })
    api.put.mockResolvedValueOnce({ data: {} })
    render(<AulaCRUD />)
    await screen.findByRole('table')
    await userEvent.type(screen.getByPlaceholderText('Nombre'), '102')
    await userEvent.type(screen.getByPlaceholderText('Capacidad'), '40')
    await userEvent.type(screen.getByPlaceholderText('Tipo'), 'laboratorio')
    const sedeSelect = document.querySelector('select[name="sede_id"]')
    await userEvent.selectOptions(sedeSelect, '5')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))
    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/aulas/',
      expect.objectContaining({ nombre: '102', capacidad: '40', tipo: 'laboratorio', sede_id: '5' })
    )
    // editar la fila 101, ya dentro del tbody
    const table = screen.getByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    const row101 = within(tbody).getAllByRole('row').find(r =>
      within(r).queryByRole('cell', { name: '101' })
    )
    await userEvent.click(within(row101).getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByPlaceholderText('Nombre'))
    await userEvent.type(screen.getByPlaceholderText('Nombre'), '101B')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))

    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/aulas/1/',
      expect.objectContaining({ nombre: '101B' })
    )
  })
})
