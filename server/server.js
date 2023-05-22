const express = require('express')
const axios = require('axios')
const btoa = require('btoa')

const app = express()

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  next()
})

const clientId = 'cea4dfeb80444395b4dc2a564f47073f' // Reemplaza con tu ID de cliente de InfoJobs
const clientSecret = 'DCwQlP+3k3oYaS3hb0YLtuTY6q2MplZ1a3GOALTAQ4GqAkP3L4' // Reemplaza con tu clave secreta de InfoJobs
const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`

// Ruta para pasar las solicitudes a la API de InfoJobs
app.get('/api/infojobs', async (req, res) => {
  try {
    const page = req.query.page || 1

    const response = await axios.get(
      `https://api.infojobs.net/api/1/offer?page=${page}`,
      {
        headers: {
          Authorization: authHeader
        }
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Ruta para obtener los requerimientos y la descripción de una oferta de trabajo por su ID
app.get('/api/job/:id', async (req, res) => {
  const jobId = req.params.id

  try {
    const response = await axios.get(
      `https://api.infojobs.net/api/1/offer/${jobId}`,
      {
        headers: {
          Authorization: authHeader
        }
      }
    )

    const jobData = {
      title: response.data.title, // Reemplaza con la propiedad correcta para obtener el título
      requirements: response.data.minRequirements, // Reemplaza con la propiedad correcta para obtener los requerimientos
      description: response.data.description // Reemplaza con la propiedad correcta para obtener la descripción
    }

    res.json(jobData)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Inicia el servidor en el puerto 3001
app.listen(3001, () => {
  console.log('Servidor iniciado en http://localhost:3001')
})
