import React, { useCallback, useEffect, useState } from 'react'

export function JobOffer() {
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:3001/api/infojobs?page=${page}`
      )
      const data = await response.json()
      const { offers } = data
      setLoading(false)
      setJobs(offers)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [page])

  useEffect(() => {
    fetchJobs()
  }, [page])

  const nextPage = () => {
    if (page === totalPages) return
    setPage(page + 1)
  }

  const prevPage = () => {
    if (page === 1) return
    setPage(page - 1)
  }

  return (
    <>
      <header className='sticky top-0 bg-GrayL3'>
        <h3 className='font-medium text-xl'>Job Offer:</h3>
        <div className='flex justify-center space-x-4 p-4'>
          <button
            className='w-24 py-2  bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none'
            onClick={prevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <p className='font-medium text-xl'>
            {page} / {totalPages}
          </p>
          <button
            className='w-24 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none'
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </header>
      {loading ? <p>Loading...</p> : null}
      <ul className='grid'>
        {jobs.map(job => (
          <li className='pb-4' key={job.id}>
            <article className='hover:animate-background  rounded-xl bg-gradient-to-r from-primary via-success to-secondary p-0.5  transition hover:via-primary hover:to-primary  hover:[animation-duration:_4s]'>
              <div className='rounded-[10px] bg-white p-4  sm:p-6'>
                <a href={job.link}>
                  <h3 className='mt-0.5 text-lg font-medium text-gray-900'>
                    {job.title}
                  </h3>
                </a>
                <span className=' text-gray-400 p-1'>{job.id}</span>

                <p className='mt-1 text-sm text-gray-500'>
                  {job.requirementMin}
                </p>

                <div className='mt-4 flex flex-wrap gap-1'>
                  <span className='whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600'>
                    {job.category.value}
                  </span>

                  <span className='whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600'>
                    {job.subcategory.value}
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  )
}
