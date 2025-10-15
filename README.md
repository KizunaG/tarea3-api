Este repositorio contiene la **API desarrollada en Node.js y Express** que recibe los datos del formulario del frontend, los procesa y los **guarda en un archivo Excel (.xlsx)** utilizando la librería **ExcelJS**.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express  
- CORS  
- ExcelJS  
- Render (para despliegue en línea)

---

## 📁 Estructura del proyecto

tarea3-api/
├── data/ # Carpeta donde se genera el archivo Excel
│ └── data.xlsx
├── server.js # Servidor principal Express
├── package.json
└── README.md

---

## ⚙️ Instalación y uso local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/KizunaG/tarea3-api.git
   cd tarea3-api
   
2. Instalar dependencias:
npm install

3. Ejecutar el servidor:
npm start

4. El backend se ejecutará en:
http://localhost:3000

🌐 Despliegue en línea (Render)
🔸 Pasos para desplegar:

Crear una cuenta en https://render.com

Conectar el repositorio tarea3-api desde GitHub

Configurar:

Build Command: npm install

Start Command: npm start

Node Version: 20

Guardar y desplegar.

🔸 URL resultante:
https://tarea3-api.onrender.com

Frontend:
https://github.com/KizunaG/tarea3-form.git
Despliegue del Frontend:
https://kizunag.github.io/tarea3-form/
