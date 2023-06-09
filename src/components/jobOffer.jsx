import useJobOffer from './Hooks/useJobOffer'

export function JobOffer() {
  const {
    jobs,
    loading,
    page,
    totalPages,
    category,
    keyword,
    nextPage,
    prevPage,
    handleCategoryChange,
    handleKeywordChange
  } = useJobOffer()

  return (
    <>
      <header className='sticky top-0 bg-GrayL3'>
        <h3 className='font-medium text-xl'>Job Offer:</h3>
        <div className='flex justify-center space-x-4 p-4'>
          <button
            className='w-24 py-2 bg-primary text-white rounded-lg hover:bg-secondary focus:outline-none'
            onClick={prevPage}
            disabled={page === 1}
          >
            Anterior
          </button>
          <p className='font-medium text-xl'>
            {page} / {totalPages}
          </p>
          <button
            className='w-24 py-2 bg-primary text-white rounded-lg hover:bg-secondary focus:outline-none'
            onClick={nextPage}
          >
            Siguiente
          </button>
        </div>
        <div className='p-1 flex justify-center gap-2 max-md:flex-col'>
          <select
            value={category}
            onChange={handleCategoryChange}
            className='px-2 py-1 border border-gray-300 rounded'
          >
            <option value=''>Todas las categorías</option>
            <option value='informatica-telecomunicaciones'>
              Informática y Telecomunicaciones
            </option>
          </select>
          <input
            type='text'
            placeholder='Palabra clave'
            value={keyword}
            onChange={handleKeywordChange}
            className='px-2 py-1 border border-gray-300 rounded'
          />
        </div>
      </header>
      {loading ? <p>Cargando...</p> : null}
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
