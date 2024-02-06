'use client'
/* eslint-disable no-unused-vars */

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
/* eslint-disable react/prop-types */
export default function Pagination({
  results = 0,
  current_page = 1,
  genre,
  estado,
  tipo,
  año,
  sortBy,
  search,
  isLoading,
  rate,
}) {
  const results_page = 24

  const total_pages = Math.ceil(results / results_page)

  const pageNumber = []
  for (let i = 1; i <= Math.ceil(results / results_page); i++) {
    pageNumber.push(i)
  }

  let url = '/directorio?'

  if (search) {
    url += `q=${search}&`
  }

  if (estado && estado.length > 0) {
    const estadoQuery = estado.join('&estado=')
    url += `estado=${estadoQuery?.replace(/\s/g, '+')}&`
  }

  if (tipo && tipo.length > 0) {
    const tipoQuery = tipo.join('&tipo=')
    url += `tipo=${tipoQuery}&`
  }

  if (año && año.length > 0) {
    const añosQuery = año?.join('&años=')
    url += `años=${añosQuery}&`
  }

  if (sortBy) {
    url += `A-Z=${sortBy}&`
  }

  if (genre && genre.length > 0) {
    const generoQuery = genre.join('&genero=').replace(/\s/g, '+')
    url += `genero=${generoQuery.replace(/\s/g, '+')}&`
  }
  if (rate) {
    url += `rating=${rate}&`
  }

  url
  const handlePageChange = (pageNumber) => {
    current_page - 1
  }

  let start = 0
  let end = 6
  if (current_page > 5 && current_page <= total_pages - 4) {
    start = current_page - 1
    end = current_page + 4
  } else if (current_page <= 5) {
    start = 0
    end = total_pages >= 6 ? 6 : total_pages
  } else if (current_page > total_pages - 4) {
    start = total_pages - 6
    end = total_pages
  }

  return (
    <div className='pagination'>
      {current_page === 1 ? null : (
        <a
          href={url + `page=${current_page - 1}`}
          className={`${isLoading ? 'disable' : 'pagination_item arrow'}`}
          onClick={handlePageChange}>
          <FaChevronLeft />
        </a>
      )}

      {pageNumber
        .map((i, index) => (
          <div key={index++}>
            <a
              href={url + `page=${i}`}
              key={index++}
              className={`${
                i === current_page
                  ? 'active pagination_item'
                  : 'pagination_item'
              }`}>
              {i}
            </a>
          </div>
        ))
        .slice(start, end)}
      {current_page === total_pages ? null : (
        <a
          href={url + `page=${current_page + 1}`}
          className={isLoading ? 'disable' : 'pagination_item arrow'}
          onClick={() => handlePageChange(current_page + 1)}>
          <FaChevronRight />
        </a>
      )}
    </div>
  )
}
