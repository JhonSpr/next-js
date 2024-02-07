'use client'
import React, { useEffect, useState } from 'react'
import { FaPlayCircle } from 'react-icons/fa'

export default function EpisodesList({ data, name }) {
  const [total_results, setTotalResults] = useState(null)
  useEffect(() => {
    setTotalResults(data?.map((e) => e.episodes__overlay)[0]?.length)
  }, [data])
  const episodesPerPage = 12
  const [currentPage, setCurrentPage] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(episodesPerPage)
  useEffect(() => {
    setStartIndex((currentPage - 1) * episodesPerPage)
    setEndIndex(currentPage * episodesPerPage)
  }, [currentPage, total_results])

  const totalEpisodes = total_results
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage)

  const handleChangePage = async (page) => {
    setCurrentPage(page)
  }
  const episodeArray = data?.map((e) => e.episodes__overlay)[0]

  return (
    <>
      <div className='episode__anime__list'>
        {episodeArray
          ?.map((e, index) => (
            <div className='episode__item' key={index}>
              <a href={`/${name[0]?.toLowerCase()}/${e.episode}`}>
                <div className='overlay'>
                  <FaPlayCircle />
                </div>
                <img src={e.image} alt={e.episode} className='episode__img' />
                <span className='episode__number'>episodio {e.episode}</span>
              </a>
            </div>
          ))
          .slice(startIndex, endIndex) ?? null}
      </div>
      <div className='episodes__pagination'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleChangePage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}>
            {`${index * episodesPerPage + 1}-${(index + 1) * episodesPerPage}`}
          </button>
        ))}
      </div>
    </>
  )
}
