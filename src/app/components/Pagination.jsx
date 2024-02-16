'use client'
/* eslint-disable no-unused-vars */

import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
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
  letra,
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

  if (letra) {
    url += `letra=${letra}&`
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
    const generoQuery = genre.join('&generos=').replace(/\s/g, '+')
    url += `generos=${generoQuery.replace(/\s/g, '+')}&`
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
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        display: 'block',
        justifyContent: 'center',
        margin: '50px 0',
      }}>
      <nav aria-label='Page navigation example'>
        <ul className='inline-flex -space-x-px text-base h-10'>
          <li>
            <a
              href={
                current_page == 1 ? null : `${url + `page=${current_page - 1}`}`
              }
              className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                current_page == 1 ? 'cursor-not-allowed' : ''
              } ${total_pages === 1 ? 'disable' : ''}`}>
              <FaArrowCircleLeft />
            </a>
          </li>
          {pageNumber
            ?.map((i, index) => (
              <li key={index}>
                <a
                  href={url + `page=${i}`}
                  aria-current={i === current_page ? i : 'none'}
                  className={
                    current_page == i
                      ? 'z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                      : 'flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }>
                  {i}
                </a>
              </li>
            ))
            .slice(start, end)}
          <li>
            <a
              href={
                current_page === total_pages
                  ? null
                  : `${url + `page=${current_page + 1}`}`
              }
              className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                current_page === total_pages ? 'cursor-not-allowed' : ''
              } ${total_pages === 1 ? 'disable' : ''}`}>
              <FaArrowCircleRight />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
