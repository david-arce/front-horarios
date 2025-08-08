// src/test/setup.ts
import '@testing-library/jest-dom'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// 🔧 muy importante para resetear useNavigate, servicios, etc. entre tests
beforeEach(() => {
  vi.clearAllMocks()
})
