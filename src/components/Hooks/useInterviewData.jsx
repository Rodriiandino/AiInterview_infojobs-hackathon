import { useState, useEffect } from 'react'
import { assignPersonality, assignCharacteristics } from '../assignType'

export default function useInterviewData() {
  const [interviewType, setInterviewType] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerIsSelected, setAnswerIsSelected] = useState(false)
  const [answerStatus, setAnswerStatus] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      // Datos del formulario en Intro.astro
      const urlParams = new URLSearchParams(window.location.search)
      const selectedInterviewType = urlParams.get('interview-type')
      const selectedInterviewer = urlParams.get('option')
      const jobId = urlParams.get('id-jobs')

      const personality = assignPersonality(selectedInterviewer)
      const characteristics = assignCharacteristics(selectedInterviewType)

      setInterviewType(characteristics)
      setInterviewer(selectedInterviewer)

      const baseUrl =
        window.location.hostname === 'localhost' &&
        window.location.port === '3001'
          ? 'http://localhost:3001/api/job'
          : 'https://aiinterviewinfojobs-hackathon-production.up.railway.app/api/job'

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interviewType: characteristics,
          interviewer: personality,
          jobId
        })
      })
      const data = await response.json()

      // Extraer preguntas y respuestas
      const completions = data.completions

      const questionStartIndex = completions.indexOf('Pregunta:')
      const questionEndIndex = completions.indexOf('Respuestas:')
      const answersEndIndex = completions.indexOf('Respuesta correcta')
      const explanationIndex = completions.indexOf('Explicación:')

      const questionText = completions
        .substring(questionStartIndex, questionEndIndex)
        .replace('Pregunta:', '')
        .trim()

      const answersText = completions
        .substring(questionEndIndex, answersEndIndex)
        .replace('Respuestas:', '')
        .trim()
        .split('\n')
        .map(answer => answer.trim())
        .filter(answer => answer !== '')

      const explanationText = completions
        .substring(explanationIndex)
        .replace('Explicación:', '')
        .trim()

      setExplanation(explanationText)
      setQuestion(questionText)
      setAnswers(answersText)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAnswerSelection = index => {
    setSelectedAnswer(index)
    setAnswerIsSelected(true)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (answers[selectedAnswer].endsWith('$')) {
      setAnswerStatus('Correcto')
    } else {
      setAnswerStatus('Incorrecto')
    }
  }

  const handleNewQuestion = () => {
    setAnswers([])
    setQuestion('')
    setSelectedAnswer(null)
    setAnswerStatus(null)
    setSubmitted(false)
    setAnswerIsSelected(false)
    fetchData() // Vuelve a cargar los datos para generar una nueva pregunta
  }

  return {
    interviewType,
    interviewer,
    question,
    answers,
    selectedAnswer,
    answerStatus,
    explanation,
    submitted,
    loading,
    answerIsSelected,
    handleAnswerSelection,
    handleSubmit,
    handleNewQuestion
  }
}
