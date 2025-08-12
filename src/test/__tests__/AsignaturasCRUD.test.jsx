// src/test/__tests__/AsignaturasCRUD.test.jsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AsignaturasCRUD from '../../components/Asignaturas/Asignaturas.jsx'
import api from '../../services/api.js'

vi.mock('../../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))

function mockCargasIniciales() {
  api.get
    .mockResolvedValueOnce({ data: [
      {
        id: 1, codigo: 123, nombre: 'IA', intensidad: '4',
        grupo: 'A', cohorte: '2025', tipo_aula: 'general', jornada: 'diurna',
        cant_estudiantes: 30, semestre: '6', plan: '2025',
        programa_id: 10,
        programa: { id: 10, nombre: 'Sistemas' },
        docentes: [{ id: 7, nombres: 'Ada', apellidos: 'Lovelace' }]
      }
    ]})
    .mockResolvedValueOnce({ data: [{ id: 10, nombre: 'Sistemas' }]})
    .mockResolvedValueOnce({ data: [{ id: 7, nombres: 'Ada', apellidos: 'Lovelace' }]})
    .mockResolvedValueOnce({ data: [{ id: 3, nombre: 'Lab 1', tipo: 'laboratorio', capacidad: 25 }]})
}

describe('AsignaturasCRUD', () => {
  test('carga y renderiza lista con mapeos de programa y docente', async () => {
    mockCargasIniciales()
    render(<AsignaturasCRUD />)
    const table = await screen.findByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    // Celdas dentro del tbody (evita opciones del formulario)
    expect(within(tbody).getByRole('cell', { name: '123' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'IA' })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: /ada lovelace/i })).toBeInTheDocument()
    expect(within(tbody).getByRole('cell', { name: 'Sistemas' })).toBeInTheDocument()
  })

  test('crea una asignatura (POST) y edita (PUT)', async () => {    mockCargasIniciales()
    api.post.mockResolvedValueOnce({ data: { id: 2 } })
    api.put.mockResolvedValueOnce({ data: {} })
    render(<AsignaturasCRUD />)
    await screen.findByRole('table')
    await userEvent.type(screen.getByPlaceholderText('Código'), '456')
    await userEvent.type(screen.getByPlaceholderText('Nombre'), 'Optimización')
    const programaSelect = document.querySelector('select[name="programa_id"]')
    await userEvent.selectOptions(programaSelect, '10')
    const docenteSelect = document.querySelector('select[name="docente_id"]')
    await userEvent.selectOptions(docenteSelect, '7')
    await userEvent.click(screen.getByRole('button', { name: /crear/i }))
    expect(api.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/asignaturas/',
      expect.objectContaining({
        codigo: '456',
        nombre: 'Optimización',
        programa_id: '10',
        docentes: expect.arrayContaining(['7'])
      })
    )
    const table = screen.getByRole('table')
    const [, tbody] = within(table).getAllByRole('rowgroup')
    const rows = within(tbody).getAllByRole('row')
    const row = rows.find(r => within(r).queryByRole('cell', { name: '123' }))
    await userEvent.click(within(row).getByRole('button', { name: /editar/i }))
    const nombre = screen.getByPlaceholderText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'IA Avanzada')
    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))
    expect(api.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/asignaturas/1',
      expect.objectContaining({ nombre: 'IA Avanzada' })
    )
  })
})
