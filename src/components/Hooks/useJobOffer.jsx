import { useCallback, useEffect, useState } from 'react'

export default function useJobOffer() {
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)

      let apiUrl =
        window.location.hostname === 'localhost' &&
        window.location.port === '3001'
          ? `http://localhost:3001/api/infojobs?page=${page}`
          : `https://aiinterviewinfojobs-hackathon-production.up.railway.app/api/infojobs?page=${page}`

      if (category) {
        apiUrl += `&category=${encodeURIComponent(category)}`
      }
      if (keyword) {
        apiUrl += `&keyword=${encodeURIComponent(keyword)}`
      }

      const response = await fetch(apiUrl)
      const data = await response.json()
      const { offers } = data

      setLoading(false)
      setJobs(offers)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [page, category, keyword])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const nextPage = () => {
    if (page === totalPages) return
    setPage(page + 1)
  }

  const prevPage = () => {
    if (page === 1) return
    setPage(page - 1)
  }

  const handleCategoryChange = e => {
    setCategory(e.target.value)
  }

  const handleKeywordChange = e => {
    setKeyword(e.target.value)
  }

  return {
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
  }
}
