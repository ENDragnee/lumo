import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-auto items-center justify-center'>
      <footer className="bottom-0 bg-transparent left-0 right-0 pb-2 text-center text-[#003366] dark:text-[#5294e2]">
      <p className="text-sm font-thin">
        &copy; ASCII Technologies PLC <span className="text-[#b8860b]">{new Date().getFullYear()}</span>
      </p>
      </footer>
    </div>
  )
}

export default Footer