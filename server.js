import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";

// Configuración base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta y archivo Excel
const DATA_DIR = path.join(__dirname, "data");
const FILE_PATH = path.join(DATA_DIR, "data.xlsx");

// Crear carpeta si no existe
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// 🟣 Función para guardar datos en Excel
async function guardarRegistro(data) {
  console.log("📩 Datos recibidos:", data);

  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
  }

  let worksheet = workbook.getWorksheet("Registros");

  if (!worksheet) {
    worksheet = workbook.addWorksheet("Registros");
    worksheet.columns = [
      { header: "Fecha", key: "fecha", width: 20 },
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Deporte", key: "deporte", width: 20 },
      { header: "Género", key: "genero", width: 15 },
      { header: "Departamento", key: "departamento", width: 20 },
      { header: "Mayoría de edad", key: "mayoria", width: 15 },
      { header: "Autos", key: "autos", width: 30 },
    ];
  }

  worksheet.addRow({
    fecha: new Date().toLocaleString(),
    nombre: data.firstName || "",
    apellido: data.lastName || "",
    deporte: data.sport || "",
    genero: data.gender || "",
    departamento: data.state || "",
    mayoria: data.age21 ? "Sí" : "No",
    autos: (data.cars || []).join(", "),
  });

  await workbook.xlsx.writeFile(FILE_PATH);
  console.log("✅ Registro agregado correctamente.");
}

// Rutas API
app.post("/submit", async (req, res) => {
  try {
    await guardarRegistro(req.body);
    res.json({ ok: true, message: "✅ Guardado en Excel" });
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    res.status(500).json({ ok: false, message: "Error al guardar" });
  }
});

app.get("/excel", (req, res) => {
  if (fs.existsSync(FILE_PATH)) {
    res.download(FILE_PATH, "registros.xlsx");
  } else {
    res.status(404).send("No hay registros todavía");
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
