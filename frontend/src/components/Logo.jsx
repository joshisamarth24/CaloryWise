import React from 'react'
import { Link } from 'react-router-dom'
import { DumbbellIcon } from './icons'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold">
        <DumbbellIcon className="h-10 w-10 text-[#4CAF50]" />
        <span className="text-[#4CAF50] text-2xl">CaloryWise</span>
    </Link>
  )
}

export default Logo
