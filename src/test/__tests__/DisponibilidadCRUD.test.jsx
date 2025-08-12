// src/test/__tests__/DisponibilidadCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DisponibilidadCRUD from '../../components/Disponibilidad/Disponibilidad.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

function mockCargas() {
  api.get
    .mockResolvedValueOnce({ data: [
      { id: 9, docente_id: 1, periodo_id: 2, dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' }
    ]})
    .mockResolvedValueOnce({ data: [{ id: 1, nombres: 'Grace', apellidos: 'Hopper' }]})
    .mockResolvedValueOnce({ data: [{ id: 2, nombre: '2025-1' }]})
}

describe('DisponibilidadCRUD', () => {
  test('renderiza lista con mapeos', async () => {
    mockCargas()
    render(<DisponibilidadCRUD />)
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    expect(within(tbody).getByRole('cell', { name: /grace hopper/i })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: '2025-1' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'Lunes' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: '08:00' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: '10:00' })).toBeInTheDocument()
  })

  test('crea (POST) y edita (PUT)', async () => {
    mockCargas()
    api.post.mockResolvedValueOnce({ data: { id: 10 } })
    api.put.mockResolvedValueOnce({ data: {} })
    render(<DisponibilidadCRUD />)
    await screen.findByRole('table')
    const docenteSel = document.querySelector('select[name="docente_id"]')
    await userEvent.selectOptions(docenteSel, '1')
    const periodoSel = document.querySelector('select[name="periodo_id"]')
    await userEvent.selectOptions(periodoSel, '2')
    const diaSel = document.querySelector('select[name="dia"]')
    await userEvent.selectOptions(diaSel, 'Martes')
    await userEvent.type(screen.getByPlaceholderText('Hora de Inicio'), '09:00')
    await userEvent.type(screen.getByPlaceholderText('Hora Fin'), '11:00')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))
    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/disponibilidades/',
      expect.objectContaining({
        docente_id: '1', periodo_id: '2', dia: 'Martes', hora_inicio: '09:00', hora_fin: '11:00'
      })
    )
    const table = screen.getByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    const row = within(tbody).getAllByRole('row').find(r => within(r).queryByRole('cell', { name: 'Lunes' }))
    await userEvent.click(within(row).getByRole('button', { name: /editar/i }))
    await userEvent.selectOptions(diaSel, 'Jueves')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))
    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/disponibilidades/9',
      expect.objectContaining({ dia: 'Jueves' })
    )
  })
})
