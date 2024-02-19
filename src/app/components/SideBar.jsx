import React from 'react'

const SideBar = ({ ultimos__episodios }) => {
  return (
    <div className='sidebar'>
      <div className='ultimos__episodios'>
        {ultimos__episodios.recientes?.map((e, index) => (
          <li key={index}>{e.nombre}</li>
        ))}
      </div>
    </div>
  )
}

export default SideBar
