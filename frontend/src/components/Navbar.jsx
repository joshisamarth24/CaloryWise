import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import Logo from './Logo'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarImage,Avatar,AvatarFallback } from './ui/avatar'
import { LogoutIcon } from '@heroicons/react/outline'
import { LogOut } from 'lucide-react'
import { logout } from '@/redux/userSlice'


const Navbar = () => {
  const user = useSelector(state=>state.user?.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-[#F5F5F5]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo/>
          <nav className="hidden space-x-4 md:flex">
            <Link
              to="/calorie-calculator"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#2196F3] hover:text-white"
            >
              Calorie Calculator
            </Link>
            <Link
              to="/food-logging"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#2196F3] hover:text-white"
            >
              Food Logging
            </Link>
            <Link
              to="/workout-logging"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#2196F3] hover:text-white"
            >
              Workout Logging
            </Link>
            <Link
              to="/progress-dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#2196F3] hover:text-white"
            >
              Progress Dashboard
            </Link>
          </nav>
          {!user ? (<div className="flex items-center gap-2">
          <Link to='/login'>
            <Button variant="outline" className="hover:bg-[#2196F3] hover:text-white">
              Sign In
            </Button>
            </Link>
            <Link to='/signup'>
            <Button className="bg-[#2196F3] text-white hover:bg-[#2196F3]/90">Sign Up</Button>
            </Link>
          </div>):(
            <div className="flex items-center gap-4">
              <Link to='/main-dashboard'>
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profilePicture || 'https://www.w3schools.com/w3images/avatar2.png'} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              </Link>
                <Button className="bg-transparent text-red-500 hover:bg-slate-200" onClick={handleLogout}>
                  <LogOut/>
                </Button>
            </div>
          )}
        </div>
      </header>
  )
}

export default Navbar