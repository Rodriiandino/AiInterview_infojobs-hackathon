import { Logo } from './logo'
import useInterviewData from './Hooks/useInterviewData'

export default function Interview() {
  const {
    interviewType,
    interviewer,
    question,
    answers,
    selectedAnswer,
    answerStatus,
    explanation,
    submitted,
    loading,
    handleAnswerSelection,
    handleSubmit,
    handleNewQuestion
  } = useInterviewData()

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
              <h3 className='font-bold mb-2 text-xl text-primary'>Enunciado</h3>
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
                  className='bg-primary text-white px-4 py-2 rounded-lg mr-2 hover:bg-secondary'
                  onClick={() => handleSubmit()}
                  disabled={loading}
                >
                  Responder
                </button>
                {submitted && (
                  <button
                    className='bg-primary text-white px-4 py-2 rounded-lg mr-2 hover:bg-secondary'
                    onClick={() => handleNewQuestion()}
                    disabled={loading}
                  >
                    Generar nueva pregunta
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
