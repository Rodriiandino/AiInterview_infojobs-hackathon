import { useState, useEffect } from 'react'
import { assignPersonality, assignCharacteristics } from './assignType'
import { Logo } from './logo'

export default function Interview() {
  const [interviewType, setInterviewType] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerStatus, setAnswerStatus] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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

        fetch(
          'https://aiinterviewinfojobs-hackathon-production.up.railway.app/api/job',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              interviewType: characteristics,
              interviewer: personality,
              jobId
            })
          }
        )
          .then(response => response.json())
          .then(data => {
            // Extraer preguntas y respuestas
            const completions = data.completions.trim()

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
          })
          .catch(error => console.error(error))
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleAnswerSelection = index => {
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (answers[selectedAnswer].endsWith('$')) {
      setAnswerStatus('Correcto')
    } else {
      setAnswerStatus('Incorrecto')
    }
  }

  return (
    <>
      <div className='bg-GrayL3 min-h-screen py-8 px-4 max-sm:px-0 max-sm:pt-0  max-sm:pb-12'>
        <div className='max-w-screen-xl mx-auto bg-white shadow rounded-lg p-6'>
          <header className='flex items-end gap-3 mb-4'>
            <Logo />
            <h1 className='text-3xl font-bold mb-2 text-GrayL2'>Entrevista</h1>
          </header>
          {loading ? (
            <p className='text-center font-bold text-lg'>Cargando...</p>
          ) : null}
          <main className=''>
            <section className='mb-4'>
              <h3 className='mb-2 text-primary font-bold text-lg'>
                Tipo de Entrevista:{' '}
                <span className='text-GrayD4 font-medium'>{interviewType}</span>{' '}
              </h3>
              <h3 className='mb-2 text-primary font-bold text-lg'>
                Entrevistador:{' '}
                <span className='text-GrayD4 font-medium'> {interviewer}</span>
              </h3>
            </section>

            <section className='mb-4'>
              <h3 className='font-bold mb-2 text-xl text-primary'>Enuciado</h3>
              <p className='text-GrayD4 text-lg'>{question}</p>
            </section>

            <section className='mb-4'>
              <h3 className='font-bold mb-2 text-xl text-primary'>
                Respuestas
              </h3>
              <ul>
                {answers.map((answer, index) => (
                  <li key={index} className='mb-2'>
                    <button
                      className={`w-full p-4 text-lg text-start hover:scale-105 ${
                        selectedAnswer === index ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => handleAnswerSelection(index)}
                    >
                      {index + 1}.{' '}
                      {answer.endsWith('$') ? answer.replace('$', '') : answer}{' '}
                      <hr />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <div>
              {submitted && (
                <div>
                  {answerStatus && (
                    <h3 className='font-bold mb-2 text-xl text-primary'>
                      Respuesta seleccionada:{' '}
                      <span className='text-secondary'>{answerStatus}</span>
                    </h3>
                  )}

                  {explanation && (
                    <section className='mb-4'>
                      <h3 className='font-bold mb-2 text-xl text-primary'>
                        Explicación
                      </h3>
                      <p className='text-GrayD4'>{explanation}</p>
                    </section>
                  )}
                </div>
              )}

              <div className='flex justify-center'>
                <button
                  className='bg-primary text-white px-4 py-2 rounded-lg mr-2'
                  onClick={() => handleSubmit()}
                >
                  Responder
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
