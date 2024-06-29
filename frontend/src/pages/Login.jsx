import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import Logo from '../components/Logo';
import { useDispatch } from 'react-redux';
import { backendUrl } from '@/Constants';
import { loginFailure, loginStart, loginSuccess } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { getUserFoods, getUserWorkouts } from '@/helpers/getUserLogs';
import { setMeals } from '@/redux/mealSlice';
import { setWorkouts } from '@/redux/workoutSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(res.status == 201){
        dispatch(loginSuccess({user: data.user, token: data.token}));
        const userFoods = await getUserFoods(data.user._id,new Date().toISOString().split('T')[0]);
        const userWorkouts = await getUserWorkouts(data.user._id, new Date().toISOString().split('T')[0]);
        dispatch(setMeals(userFoods))
        dispatch(setWorkouts(userWorkouts))
        navigate('/');
      }
      else{
        dispatch(loginFailure());
      }
      
    } catch (error) {
      console.log(error)
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <div className="mb-6 flex justify-center items-center">
          <Logo />
        </div>
        <h2 className="text-3xl font-semibold text-center text-green-500 mb-8">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <input 
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="h-6 w-6 text-gray-400" />
              ) : (
                <EyeIcon className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button 
              type="submit"
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
