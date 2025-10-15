// server.js
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import ExcelJS from 'exceljs'
import { fileURLToPath } from 'url'

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// ===== Config =====
const DATA_DIR   = path.join(__dirname, 'data')
const FILE_NAME  = 'registros.xlsx'          // <— UN SOLO NOMBRE
const FILE_PATH  = path.join(DATA_DIR, FILE_NAME)
const SHEET_NAME = 'Registros'

// Asegura carpeta
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

async function guardarRegistro(data) {
  // 1) Abre workbook (existente) o crea uno nuevo
  const wb = new ExcelJS.Workbook()
  if (fs.existsSync(FILE_PATH)) {
    await wb.xlsx.readFile(FILE_PATH)
  }
  // 2) Obtén/crea hoja
  let ws = wb.getWorksheet(SHEET_NAME)
  if (!ws) {
    ws = wb.addWorksheet(SHEET_NAME)
    ws.columns = [
      { header: 'Fecha',            key: 'fecha',       width: 22 },
      { header: 'Nombre',           key: 'nombre',      width: 18 },
      { header: 'Apellido',         key: 'apellido',    width: 18 },
      { header: 'Deporte',          key: 'deporte',     width: 14 },
      { header: 'Género',           key: 'genero',      width: 10 },
      { header: 'Departamento',     key: 'departamento',width: 16 },
      { header: 'Mayoría de edad',  key: 'mayoria',     width: 14 },
      { header: 'Autos',            key: 'autos',       width: 22 },
    ]
  }

  // 3) Append de fila
  ws.addRow({
    fecha: new Date().toLocaleString('es-GT'),
    nombre:     data.firstName ?? '',
    apellido:   data.lastName ?? '',
    deporte:    data.sport ?? '',
    genero:     data.gender ?? '',
    departamento: data.state ?? '',
    mayoria:    data.age21 ? 'Sí' : 'No',
    autos:      Array.isArray(data.cars) ? data.cars.join(', ') : ''
  })

  // 4) Guarda (con manejo de archivo bloqueado)
  try {
    await wb.xlsx.writeFile(FILE_PATH)
    console.log('✅ Fila añadida. Total filas:', ws.rowCount)
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.error('❌ El archivo está abierto en Excel. Ciérralo y reintenta.')
      throw new Error('Archivo bloqueado por Excel')
    }
    throw err
  }
}

// ==== API ====

// Crear/append de registro desde el frontend
app.post('/submit', async (req, res) => {
  try {
    console.log('→ Datos recibidos:', req.body)
    await guardarRegistro(req.body)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, error: e.message })
  }
})

// Descarga del Excel (sin caché del navegador)
app.get('/excel', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  if (fs.existsSync(FILE_PATH)) {
    return res.download(FILE_PATH, FILE_NAME)
  }
  res.status(404).send('No hay registros todavía')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`)
  console.log('📄 Excel:', FILE_PATH)
})
