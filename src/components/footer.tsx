import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-auto items-center justify-center'>
      <footer className="bottom-0 pl-16 left-0 right-0 pb-2 bg-transparent text-center text-[#003366] dark:text-[#5294e2] shadow-lg bg-">
      <p className="text-sm font-thin">
        &copy; ASCII Technologies PLC <span className="text-[#b8860b]">{new Date().getFullYear()}</span>
      </p>
      </footer>
    </div>
  )
}

export default Footer