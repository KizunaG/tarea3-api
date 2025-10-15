import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import ExcelJS from 'exceljs'
import { fileURLToPath } from 'url'

// Configurar __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// 📁 Carpeta donde se guardará el Excel
const DATA_DIR = path.join(__dirname, 'data')
const FILE_PATH = path.join(DATA_DIR, 'data.xlsx')

// 🧾 Crear el archivo y hoja si no existen
async function ensureWorkbook() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)
  const workbook = new ExcelJS.Workbook()

  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH)
  } else {
    const ws = workbook.addWorksheet('Registros')
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Apellido', key: 'apellido', width: 20 },
      { header: 'Deporte', key: 'deporte', width: 15 },
      { header: 'Género', key: 'genero', width: 15 },
      { header: 'Departamento', key: 'departamento', width: 20 },
      { header: 'Mayoría de edad', key: 'mayoria', width: 15 },
      { header: 'Autos', key: 'autos', width: 30 }
    ]
    await workbook.xlsx.writeFile(FILE_PATH)
  }

  await workbook.xlsx.readFile(FILE_PATH)
  return workbook
}

// 📤 Guardar datos del formulario
app.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, sport, gender, state, age21, cars } = req.body
    const workbook = await ensureWorkbook()
    const sheet = workbook.getWorksheet('Registros')

    sheet.addRow({
      fecha: new Date().toLocaleString('es-GT'),
      nombre: firstName,
      apellido: lastName,
      deporte: sport,
      genero: gender,
      departamento: state,
      mayoria: age21 ? 'Sí' : 'No',
      autos: Array.isArray(cars) ? cars.join(', ') : ''
    })

    await workbook.xlsx.writeFile(FILE_PATH)
    res.json({ ok: true, message: 'Registro guardado correctamente ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al guardar en Excel' })
  }
})

// 📥 Descargar el archivo Excel
app.get('/excel', async (req, res) => {
  try {
    if (!fs.existsSync(FILE_PATH)) await ensureWorkbook()
    res.download(FILE_PATH, 'registros.xlsx')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error al descargar el archivo')
  }
})

// 🚪 Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
