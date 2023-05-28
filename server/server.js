const express = require('express')
const axios = require('axios')
const btoa = require('btoa')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
)

const clientId = process.env.INFOJOB_CLIENT_KEY // Reemplaza con tu ID de cliente de InfoJobs
const clientSecret = process.env.INFOJOB_SECRET_KEY // Reemplaza con tu clave secreta de InfoJobs
const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

// Función para generar preguntas y respuestas
const generateQuestions = async ({ interviewType, interviewer, jobData }) => {
  try {
    // Lógica para generar las preguntas y respuestas usando OpenAI
    // Aquí debes usar los datos obtenidos del formulario (tipo de trabajo, actuación del entrevistador, tipo de entrevista, etc.)

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Vas a ser un entrevistador, tu función es realizar una entrevista del tipo [${interviewType}]. La cual tu personalidad debe alinearse con las características de este entrevistador [[[${interviewer}]]].
    
      Para esta entrevista, nos centraremos en los requisitos del puesto y los datos laborales proporcionados. El trabajo implica las siguientes características: [[${jobData}]]
      
      Tu tarea es generar una pregunta y cuatro respuestas posibles, con solo una respuesta correcta.

      Ejemplo:
      
      Pregunta: [Generar una pregunta basada en [[${jobData}]]]
      
      Respuestas:
      1. Opción 1
      2. Opción 2
      3. Opción 3 $
      4. Opción 4
      
      La respuesta es la opción 3. [Explicación de por qué es la opción 3]

      Datos Adicionales: 

      Asegúrate de que solo haya una respuesta correcta.
      
      La respuesta correcta debe terminar con el símbolo de dolar ($).
      
      "La frase que está rodeada por un corchete es el tipo de entrevista, la frase que está rodeada por dos corchetes son los datos del trabajo y la frase que está rodeada por tres corchetes es el entrevistador".
      
      Estos son los datos para la entrevista:
      
      [${interviewType}] [[[${interviewer}]]] [[${jobData}]]`,
      temperature: 0.7,
      max_tokens: 250,
      top_p: 1
    })

    const completions = response.data.choices[0].text

    if (completions) {
      console.log('Completions:', completions)
      return completions
    } else {
      throw new Error('Invalid response from OpenAI')
    }
  } catch (error) {
    console.error('Error generating questions:', error)
    // Manejo de errores, si es necesario
  }
}

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

app.post('/api/job', async (req, res) => {
  const jobId = req.body.jobId
  const interviewType = req.body.interviewType
  const interviewer = req.body.interviewer

  const jobData = {}

  try {
    const response = await axios.get(
      `https://api.infojobs.net/api/1/offer/${jobId}`,
      {
        headers: {
          Authorization: authHeader
        }
      }
    )

    jobData.title = response.data.title
    jobData.requirements = response.data.minRequirements

    // Generar preguntas y respuestas

    // const completions = await generateQuestions({
    //   interviewType,
    //   interviewer,
    //   jobData
    // })

    const completions = `
    Pregunta: ¿Cuál de las siguientes tecnologías es fundamental para el desarrollo de software con Java Spring Boot?

    Respuestas:
    
    HTML
    Python
    JavaScript
    Hibernate $
    La respuesta es la opción 4, Hibernate
    `

    // Enviar preguntas y respuestas junto con los datos de la oferta de trabajo
    res.json({ jobData, completions })
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
      title: response.data.title,
      requirements: response.data.minRequirements,
      description: response.data.description
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
