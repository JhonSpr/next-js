'use client'

import { IoMdRemoveCircle } from 'react-icons/io'

function Alert({ isVisible, message, remove, handleClose }) {
  return isVisible ? (
    remove ? (
      <div
        style={{
          visibility: `${isVisible ? 'visible' : 'hidden'}`,
          position: 'fixed',
          bottom: '30px',
          zIndex: '9999',
        }}
        id='alert-2'
        className='flex items-center p-4 mb-4  alert'
        role='alert'>
        <svg
          className='flex-shrink-0 w-4 h-4'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'>
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
        </svg>
        <span className='sr-only'>Info</span>
        <div className='ms-3 text-sm font-medium'>{message}</div>
        <button
          type='button'
          className='ms-auto -mx-1.5 -my-1.5  rounded-lg  p-1.5  inline-flex items-center justify-center h-8 w-8 '
          data-dismiss-target='#alert-3'
          aria-label='Close'
          onClick={handleClose}>
          <span className='sr-only'>Close</span>
          <IoMdRemoveCircle />
        </button>
      </div>
    ) : (
      <div
        style={{
          visibility: `${isVisible ? 'visible' : 'hidden'}`,
          position: 'fixed',
          bottom: '30px',
        }}
        id='alert-3'
        className='flex items-center p-4 mb-4  rounded-lg  alert'
        role='alert'>
        <svg
          className='flex-shrink-0 w-4 h-4'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'>
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
        </svg>
        <span className='sr-only'>Info</span>
        <div className='ms-3 text-sm font-medium'>{message}</div>
        <button
          type='button'
          className='ms-auto -mx-1.5 -my-1.5  rounded-lg  p-1.5  inline-flex items-center justify-center h-8 w-8 '
          data-dismiss-target='#alert-3'
          aria-label='Close'
          onClick={handleClose}>
          <span className='sr-only'>Close</span>
          <IoMdRemoveCircle />
        </button>
      </div>
    )
  ) : null
}

export default Alert
