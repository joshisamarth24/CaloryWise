import React from 'react'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import FoodLogging from './pages/FoodLogging'
import CalorieCalculator from './pages/CalorieCalculator'
import MainDashboard from './pages/MainDashboard'
import LoginForm from './pages/Login'
import SignupForm from './pages/Signup'
import Navbar from './components/Navbar'
import WorkoutLogging from './pages/WorkoutLogging'
import ProgressDashboard from './pages/ProgressDashboard'
import { useSelector } from 'react-redux'


const App = () => {
  const {user} = useSelector((state)=>state.user);

  return (
    <BrowserRouter>
    <Toaster />
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/calorie-calculator" element={<CalorieCalculator />} />
        <Route path="/food-logging" element={!user ? <Navigate to='/'/> :<FoodLogging />} />
        <Route path="/workout-logging" element={!user ? <Navigate to='/'/> :<WorkoutLogging />} />
        <Route path="/main-dashboard" element={!user ? <Navigate to='/'/> :<MainDashboard />} />
        <Route path="/progress-dashboard" element={!user ? <Navigate to='/'/> :<ProgressDashboard/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App