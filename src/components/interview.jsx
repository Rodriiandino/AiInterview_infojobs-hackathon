import { useState, useEffect } from 'react'
import { Logo } from './logo'

export default function Interview() {
  const [interviewType, setInterviewType] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [jobData, setJobData] = useState(null)
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerStatus, setAnswerStatus] = useState(null)
  const [explanation, setExplanation] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos del formulario en Intro.astro
        const urlParams = new URLSearchParams(window.location.search)
        const selectedInterviewType = urlParams.get('interview-type')
        const selectedInterviewer = urlParams.get('option')
        const jobId = urlParams.get('id-jobs')

        setInterviewType(selectedInterviewType)
        setInterviewer(selectedInterviewer)

        fetch('http://localhost:3001/api/job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            interviewType: selectedInterviewType,
            interviewer: selectedInterviewer,
            jobId
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setJobData(data)

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

            console.log(completions)
            console.log(questionText)
            console.log(answersText)

            setExplanation(explanationText)
            setQuestion(questionText)
            setAnswers(answersText)
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

    if (answers[index].endsWith('$')) {
      setAnswerStatus('Correcto')
    } else {
      setAnswerStatus('Incorrecto')
    }
  }

  return (
    <>
      <div className='bg-GrayL3 min-h-screen py-8 px-4'>
        <div className='max-w-screen-xl mx-auto bg-white shadow rounded-lg p-6'>
          <header className='flex items-end gap-3 mb-4'>
            <Logo />
            <h1 className='text-3xl font-bold mb-2 text-GrayL2'>Interview</h1>
          </header>

          <main className=''>
            <section mb-4>
              <h3 className='mb-2 text-primary font-bold text-lg'>
                Interview type:{' '}
                <span className='text-GrayD4 font-medium'>{interviewType}</span>{' '}
              </h3>
              <h3 className='mb-2 text-primary font-bold text-lg'>
                Interviewer:{' '}
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
          </main>

          <footer>
            {answerStatus && (
              <p className='text-primary mb-4'>
                Respuesta seleccionada: {answerStatus}
              </p>
            )}

            {explanation && (
              <section className='mb-4'>
                <h3 className='font-bold mb-2 text-xl text-primary'>
                  Explicación
                </h3>
                <p className='text-GrayD4'>{explanation}</p>
              </section>
            )}

            <div className='flex justify-center'>
              <button className='bg-primary text-white px-4 py-2 rounded mr-2'>
                Submit
              </button>
              <button className='bg-secondary text-white px-4 py-2 rounded'>
                Cancel
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
