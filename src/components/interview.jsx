import { useState, useEffect } from 'react'

export default function Interview() {
  const [interviewType, setInterviewType] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [jobData, setJobData] = useState(null)

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
          })
          .catch(error => console.error(error))
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h1>Interview</h1>
      <p>Interview type: {interviewType}</p>
      <p>Interviewer: {interviewer}</p>
      <p>Job data: {JSON.stringify(jobData)}</p>
    </>
  )
}
