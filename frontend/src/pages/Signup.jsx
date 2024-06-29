import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import Logo from '../components/Logo';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '@/Constants';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDaysIcon } from 'lucide-react';
import calculateNetCalorieRequirement from '@/helpers/caloryCalculations';


const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goals: {
      goalType: '',
      targetWeight: null,
      targetDate: null
    },
    profilePicture: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-US');
    setFormData({
      ...formData,
      goals: {
        ...formData.goals,
        targetDate: formattedDate
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetWeight') {
      setFormData({
        ...formData,
        goals: {
          ...formData.goals,
          [name]: parseFloat(value)  // Convert targetWeight to number
        }
      });
    }else if(name === 'goalType'){
        setFormData({
            ...formData,
            goals: {
              ...formData.goals,
              [name]: value
            }  
        });
    } 
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const uploadImage = async(img)=>{
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/drt9c7qcn/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: img,
          upload_preset: 'caloryWise',
        }),
      });
      const data = await res.json();
    setFormData({
      ...formData,
      profilePicture: data.secure_url
    });
      
    } catch (error) {
      console.log(error);
      toast.error("Error uploading image, please try again later.")
    }
  }

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = async() => {
      if(reader.readyState === 2){
        await uploadImage(reader.result);
      }
    }
    console.log(image)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      profilePicture: image
    });
    try {
      dispatch(loginStart());
      const dailyCalorieGoal = calculateNetCalorieRequirement(formData.weight, formData.goals.targetWeight, formData.height, formData.age, formData.gender, formData.activityLevel, formData.goals.goalType, formData.goals.targetDate);
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({...formData,dailyCalorieGoal}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if(res.status === 201){
        dispatch(loginSuccess({user:data.newUser,token:data.token}));
        navigate('/main-dashboard');
      }
      else{
        dispatch(loginFailure());
      }
      
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <div className="mb-6 flex justify-center items-center">
          <Logo />
        </div>
        <h2 className="text-3xl font-semibold text-center text-green-500 mb-8">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input 
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <input 
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-6 w-6 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-6 w-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <input 
                id="age"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <select
                id="gender"
                name="gender"
                placeholder="Select Gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div>
              <input 
                id="weight"
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <input 
                id="height"
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <select
                id="activityLevel"
                name="activityLevel"
                placeholder="Select Activity Level"
                value={formData.activityLevel}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              >
                <option value="">Select Activity Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Super Active">Super Active</option>
              </select>
            </div>

            <div>
              <select
                id="goalType"
                name="goalType"
                placeholder="Select Goal Type"
                value={formData.goals.goalType}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              >
                <option value="">Select Goal Type</option>
                <option value="weightLoss">Weight Loss</option>
                <option value="weightGain">Weight Gain</option>
                <option value="maintainWeight">Maintain Weight</option>
              </select>
            </div>

            <div>
              <input 
                id="targetWeight"
                type="number"
                name="targetWeight"
                placeholder="Target Weight (kg)"
                value={formData.goals.targetWeight || ''}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="pl-3 text-left font-normal text-muted-foreground">
                    {formData.goals.targetDate || "Select Date"}
                    <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={formData.goals.targetDate} onSelect={handleDateChange} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Profile Picture field (optional) */}
            <div className="md:col-span-2">
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input 
                id="profilePicture"
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mt-6">
            <button 
              type="submit"
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};





export default SignupForm;

