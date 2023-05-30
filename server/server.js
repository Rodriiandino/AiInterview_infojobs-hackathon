const express = require('express')
const axios = require('axios')
const btoa = require('btoa')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

// Configuración de Express
const app = express()
const port = process.env.PORT || 3001
app.use(bodyParser.json())

app.use(cors())

// Configuración de InfoJobs
const clientId = process.env.INFOJOB_CLIENT_KEY // ID de cliente de InfoJobs
const clientSecret = process.env.INFOJOB_SECRET_KEY // Clave secreta de InfoJobs
const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

// Función para generar preguntas y respuestas
const generateQuestions = async ({ interviewType, interviewer, jobData }) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Vas a ser un entrevistador, tu función es realizar una entrevista del tipo ${interviewType}. La cual tu personalidad debe alinearse con las características de este entrevistador ${interviewer}.
    
      Para esta entrevista, nos centraremos en los requisitos del puesto y los datos laborales proporcionados. El trabajo implica las siguientes características: 
      
      titulo de la oferta de trabajo: ${jobData.title},
      requisitos mínimos: ${jobData.requirements}.
      
      Tu tarea es generar una pregunta y cuatro respuestas posibles, con solo una respuesta correcta.

      Ejemplo de cual tiene que ser el resultado:
      
      Pregunta: PRETENDO QUE ESTA SEA LA PREGUNTA

      Respuestas:
      
      RESPUESTAS POSIBLES 
      RESPUESTAS POSIBLES
      RESPUESTAS POSIBLES $  
      RESPUESTAS POSIBLES 

      Respuesta correcta: LA RESPUESTA QUE ES CORRECTA.

      Explicación: EXPLICACIÓN DE POR QUE ES LA RESPUESTA CORRECTA.

      No te olvides de Cumples con los siguientes requisitos:

      1. Asegúrate de que solo haya una respuesta correcta y el orden de cual es la correcta sea ramdom.

      2. Usar el formato de pregunta y respuesta de arriba.
      
      3. La respuesta correcta debe terminar con el símbolo de dolar ($).`,
      temperature: 0.5,
      max_tokens: 500,
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
    // Manejo de errores
  }
}

// Ruta para pasar las solicitudes de ofertas de trabajo de InfoJobs
app.get('/api/infojobs', async (req, res) => {
  try {
    const page = req.query.page || 1
    const category = req.query.category
    const keyword = req.query.keyword

    let apiUrl = `https://api.infojobs.net/api/1/offer?page=${page}`

    if (category) {
      apiUrl += `&category=${category}`
    }

    if (keyword) {
      apiUrl += `&q=${keyword}`
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authHeader
      }
    })

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

    // Preguntas y respuestas de prueba para evitar el uso de OpenAI
    const completions = `
    Pregunta: ¿Qué lenguaje de programación es el más usado para desarrollar aplicaciones de internet?

    Respuestas:
    Java
    C
    JavaScript $
    PHP

    Respuesta correcta: JavaScript $

    Explicación: JavaScript es un lenguaje de programación de alto nivel, orientado a objetos, que se ha convertido en el lenguaje más usado para desarrollar aplicaciones de internet.
    `

    // Enviar preguntas y respuestas junto con los datos de la oferta de trabajo
    res.json({ jobData, completions })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Ruta para obtener de los datos de una oferta de trabajo de InfoJobs
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

app.listen(port, () => {
  console.log(`Servidor iniciado en ${port}`)
})
