import { useState, useEffect } from 'react'
import axios from 'axios'
import { Configuration, OpenAIApi } from 'openai'

export default function ChatComponent() {
  const apiKey = '' // Reemplaza con tu propia clave de API de OpenAI

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [interviewType, setInterviewType] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [jobData, setJobData] = useState(null)

  const configuration = new Configuration({ apiKey: apiKey })
  const openai = new OpenAIApi(configuration)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtén los datos del formulario en Intro.astro
        const urlParams = new URLSearchParams(window.location.search)
        const selectedInterviewType = urlParams.get('interview-type')
        const selectedInterviewer = urlParams.get('option')
        const jobId = urlParams.get('id-jobs')
        setInterviewType(selectedInterviewType)
        setInterviewer(selectedInterviewer)

        // Obtener los datos del trabajo desde la API
        const response = await axios.get(
          `http://localhost:3001/api/job/${jobId}`
        )
        setJobData(response.data)

        // Resto de tu código que depende de los datos del trabajo
        // ...
      } catch (error) {
        console.error('Error:', error)
        // Manejo de errores, si es necesario
      }
    }

    fetchData()
  }, [])

  const SYSTEM_MESSAGE = {
    type: 'system',
    content: `As an interviewer, your role is to conduct a {interviewType} interview. Your approach and personality should align with the characteristics of a {interviewer} interviewer.

    For this interview, we will be focusing on the position requirements and job data provided. The job entails the following qualifications: {jobData}
    
    Let's proceed with the question and answer session. Your task is to generate a question and four possible answers, with only one answer being correct.
    
    Question: [Generate a question based on the jobData]
    
    Answers:
    1. [Option 1]
    2. [Option 2]
    3. [Option 3]
    4. [Option 4]
    
    Please ensure that only one answer is correct. Good luck with the interview!`
  }

  const EXAMPLES_MESSAGE = [
    {
      role: 'user',
      content:
        'Quiero que mi entrevista sea del tipo de "Technical Interview", El titulo de la empresa es "SUPERVISOR/A ELECTROMÉCANICO/A  (MÉRIDA)", Tiene los siguientes requerimientos "Mínimo 5 años de experiencia en la construcción de subestaciones.\r\nCurso básico de PRL de 60 h.\r\nIngeniería eléctrica o electromecánica.\r\nValorable conocimientos de puesta en marcha de subestaciones.\r\nExperiencia en proyectos fotovoltaicos.".'
    },
    {
      role: 'assistant',
      content: `Pregunta: ¿Cuál de los siguientes requisitos es necesario para aplicar al puesto de "Supervisor/a Electromecánico/a" en la empresa "MÉRIDA"?

        Respuestas:
        
        Tener experiencia en la construcción de subestaciones.
        Haber realizado un curso básico de PRL de 60 horas.
        Poseer una licenciatura en ingeniería eléctrica o electromecánica.
        Tener conocimientos de puesta en marcha de subestaciones fotovoltaicas.

        Respuesta correcta: Tener experiencia en la construcción de subestaciones.`
    }
  ]

  // Función para generar preguntas y respuestas
  const generateQuestions = async ({ interviewType, interviewer, jobData }) => {
    try {
      // Lógica para generar las preguntas y respuestas usando OpenAI
      // Aquí debes usar los datos obtenidos del formulario (tipo de trabajo, actuación del entrevistador, tipo de entrevista, etc.)

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        menssages: [
          SYSTEM_MESSAGE,
          ...EXAMPLES_MESSAGE,
          {
            role: 'user',
            content: `${interviewType} ${interviewer} ${jobData}`
          }
        ]
      })

      const completion = response.data.choices[0].text

      // Aquí debes guardar las preguntas y respuestas generadas en el estado
      setAnswers(prevAnswers => [...prevAnswers, completion])
      setQuestions(prevQuestions => [...prevQuestions, completion])
    } catch (error) {
      console.error('Error generating questions:', error)
      // Manejo de errores, si es necesario
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtén los datos del formulario en Intro.astro
        const urlParams = new URLSearchParams(window.location.search)
        const selectedInterviewType = urlParams.get('interview-type')
        const selectedInterviewer = urlParams.get('option')
        const jobId = urlParams.get('id-jobs')
        setInterviewType(selectedInterviewType)
        setInterviewer(selectedInterviewer)

        // Obtener los datos del trabajo desde la API
        const response = await axios.get(
          `http://localhost:3001/api/job/${jobId}`
        )
        setJobData(response.data)

        // Generar preguntas después de obtener los datos del trabajo
        generateQuestions({
          interviewType: selectedInterviewType,
          interviewer: selectedInterviewer,
          jobData: jobData
        })
      } catch (error) {
        console.error('Error:', error)
        // Manejo de errores, si es necesario
      }
    }

    fetchData()
  }, [])

  console.log('interviewType', interviewType)
  console.log('interviewer', interviewer)
  console.log('jobData', jobData)
  console.log('questions', questions)
  console.log('answers', answers)

  return (
    <div>
      <h1>ChatComponent</h1>
    </div>
  )
}
