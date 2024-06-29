import React from 'react'
import { Link } from 'react-router-dom'
import { DumbbellIcon, HandPlatterIcon, TimerIcon, GitGraphIcon } from '../components/icons.jsx'
import { Button } from '../components/ui/button'
import { useSelector } from 'react-redux'


const Home = () => {
  const {user} = useSelector(state=>state.user);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] text-[#212121]">
      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#2196F3] to-[#4CAF50] py-20 sm:py-32 lg:py-40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Welcome to CaloryWise</h1>
              <p className="mt-4 text-xl">Your personal fitness and nutrition tracker.</p>
             {!user &&  <div className="mt-8 flex justify-center gap-4">
             <Link to='/signup'>
                <Button variant ="outline" className="bg-white text-[#2196F3]">Get Started</Button>
              </Link>  
              </div>}
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                Icon={DumbbellIcon} 
                title="Calorie Calculator" 
                description="Calculate your daily caloric needs based on your activity level and fitness goals."
                href="/calorie-calculator"
              />
              <FeatureCard 
                Icon={HandPlatterIcon} 
                title="Food Logging" 
                description="Easily log your meals and keep track of your calorie and macronutrient intake."
                href="/food-logging"
              />
              <FeatureCard 
                Icon={TimerIcon} 
                title="Workout Logging" 
                description="Log your workouts and track the calories burned during each session."
                href="/workout-logging"
              />
              <FeatureCard 
                Icon={GitGraphIcon} 
                title="Progress Dashboard" 
                description="Visualize your progress towards your fitness and nutritional goals."
                href="/progress-dashboard"
              />
            </div>
          </div>
        </section>
        <section className="bg-[#F5F5F5] py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[#212121] sm:text-4xl">Why Choose CaloryWise?</h2>
              <p className="mt-4 text-[#212121]/80">
                CaloryWise is the ultimate tool for managing your health and fitness journey. With our comprehensive
                features, you can take control of your nutrition, workouts, and progress.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                Icon={DumbbellIcon} 
                title="Personalized Tracking" 
                description="Our calorie and macronutrient calculator helps you determine your individual needs, making it easier to achieve your fitness goals."
              />
              <FeatureCard 
                Icon={HandPlatterIcon} 
                title="Comprehensive Logging" 
                description="Easily log your meals, workouts, and progress to gain a complete understanding of your health journey."
              />
              <FeatureCard 
                Icon={GitGraphIcon} 
                title="Insightful Analytics" 
                description="Our progress dashboard provides detailed visualizations to help you track your improvements and stay motivated."
              />
            </div>
          </div>
        </section>
        {!user && <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[#212121] sm:text-4xl">Get Started with CaloryWise</h2>
              <p className="mt-4 text-[#212121]/80">
                Sign up today and start your journey towards a healthier, fitter you.
              </p>
              <div className="mt-8 flex justify-center">
                <Button className="bg-[#2196F3] text-white hover:bg-[#2196F3]/90">Sign Up</Button>
              </div>
            </div>
          </div>
        </section>}
      </main>
      <footer className="bg-[#F5F5F5] py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <DumbbellIcon className="h-6 w-6 text-[#4CAF50]" />
              <span className="text-sm font-medium text-[#212121]">CaloryWise</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-sm font-medium text-[#212121]/80 hover:text-[#2196F3]">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm font-medium text-[#212121]/80 hover:text-[#2196F3]">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm font-medium text-[#212121]/80 hover:text-[#2196F3]">
                Contact Us
              </Link>
            </nav>
            <p className="text-sm text-[#212121]/80">&copy; 2024 CaloryWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
 
    </div>
  )
}

function FeatureCard({ Icon, title, description, href }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm transition-colors duration-300">
      <Icon className="mb-4 h-8 w-8 text-[#4CAF50]" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-[#212121]/80">{description}</p>
      {href && (
        <Link to={href} className="mt-4 inline-flex items-center text-sm font-medium cursor-pointer text-[#2196F3] hover:text-[#4CAF50]">
          Have a look <span className="ml-1">→</span>
        </Link>
      )}
    </div>
  )
}

export default Home
