import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { updateUser } from "@/redux/userSlice";
import toast from "react-hot-toast";
import { backendUrl } from "@/Constants";
import calculateNetCalorieRequirement from "@/helpers/caloryCalculations";
import Log from "@/components/Log";
import { getFoodsByDateRange, getUserFoods, getUserWorkouts, getWorkoutsByDateRange } from "@/helpers/getUserLogs";


export default function MainDashboard() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [calories, setCalories] = useState(0);
  const [workouts, setWorkouts] = useState([])
  const [meals, setMeals] = useState([])
  const [workoutRange, setWorkoutRange] = useState({
    start:`${new Date().toISOString().split('T')[0]}`,end:`${new Date().toISOString().split('T')[0]}`
  })
  const [foodRange, setFoodRange] = useState({
    start:`${new Date().toISOString().split('T')[0]}`,end:`${new Date().toISOString().split('T')[0]}`
  })

  const [formData, setFormData] = useState({
    weight: user?.weight || '',
    height: user?.height || '',
    goalType: user?.goals?.goalType || '',
    targetWeight: user?.goals?.targetWeight || '',
    targetDate: user?.goals?.targetDate || '',
  });

  useEffect(() => {
    if(user && workoutRange.start && workoutRange.end){
      if(workoutRange.start === workoutRange.end){
        getUserWorkouts(user?._id,workoutRange.start).then((data) => {
          setWorkouts(data)
        })
      }else{
      getWorkoutsByDateRange(workoutRange.start,workoutRange.end,user._id).then((data) => {
        setWorkouts(data)
      })
    }
  }
  }, [user,workoutRange])

  useEffect(() => {
    if(user && foodRange.start && foodRange.end){
      if(foodRange.start === foodRange.end){
        getUserFoods(user._id,foodRange.start).then((data) => {
          setMeals(data)
        })
      }else{
      getFoodsByDateRange(foodRange.start,foodRange.end,user?._id).then((data) => {
        setMeals(data)
      })
    }
    }
  }, [user,foodRange])


  useEffect(() => {
    if (formData.weight && formData.height && formData.goalType && formData.targetWeight && formData.targetDate) {
      const netDailyRequirement = calculateNetCalorieRequirement(
        parseFloat(formData.weight),
        parseFloat(formData.targetWeight),
        parseFloat(formData.height),
        user?.age, // Assuming age is available in user object
        user?.gender, // Assuming gender is available in user object
        user?.activityLevel, // Assuming activity level is available in user object
        formData.goalType,
        new Date(formData.targetDate)
      );
      setCalories(netDailyRequirement);
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    if(date < new Date()) return toast("Please select a future date");
    setFormData((prevData) => ({
      ...prevData,
      targetDate: `${formattedMonth}/${formattedDay}/${year}`,
    }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!validateFormData(formData)) return;
    dispatch(updateUser(formData));
    try {
      const res = await fetch(`${backendUrl}/user/updateUser/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, dailyCalorieGoal: calories}),
      });
      if(res.status === 200) toast.success("Profile updated successfully");
      else toast.error("Something went wrong");
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
  };

  const handleMealRange = (val) => {
    if(val === 'today'){
      setFoodRange({start:new Date().toISOString().split('T')[0],end:new Date().toISOString().split('T')[0]})
    }else if(val === 'yesterday'){
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1)
      setFoodRange({start:yesterday.toISOString().split('T')[0],end:yesterday.toISOString().split('T')[0]})
    } else if(val === 'thisWeek'){
      const today = new Date();
      const start = today.getDate() - today.getDay();
      const end = start + 6;
      const startDate = new Date(today.setDate(start)).toISOString().split('T')[0];
      const endDate = new Date(today.setDate(end)).toISOString().split('T')[0];
      setFoodRange({start:startDate,end:endDate})
    } else if(val === 'lastWeek'){
      const today = new Date();
      const start = today.getDate() - today.getDay() - 7;
      const end = start + 6;
      const startDate = new Date(today.setDate(start)).toISOString().split('T')[0];
      const endDate = new Date(today.setDate(end)).toISOString().split('T')[0];
      setFoodRange({start:startDate,end:endDate})
    }
 }

 const handleWorkoutRange = (val) => {
    if(val === 'today'){
      setWorkoutRange({start:new Date().toISOString().split('T')[0],end:new Date().toISOString().split('T')[0]})
    }else if(val === 'yesterday'){
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1)
      setWorkoutRange({start:yesterday.toISOString().split('T')[0],end:yesterday.toISOString().split('T')[0]})
    } else if(val === 'thisWeek'){
      const today = new Date();
      const start = today.getDate() - today.getDay();
      const end = start + 6;
      const startDate = new Date(today.setDate(start)).toISOString().split('T')[0];
      const endDate = new Date(today.setDate(end)).toISOString().split('T')[0];
      setWorkoutRange({start:startDate,end:endDate})
    } else if(val === 'lastWeek'){
      const today = new Date();
      const start = today.getDate() - today.getDay() - 7;
      const end = start + 6;
      const startDate = new Date(today.setDate(start)).toISOString().split('T')[0];
      const endDate = new Date(today.setDate(end)).toISOString().split('T')[0];
      setWorkoutRange({start:startDate,end:endDate})
    }
  }

  return (
    <div className="w-full">
      <Card className="w-full max-w-none">
        <CardHeader className="bg-gradient-to-r from-[#ff6b6b] to-[#ffa500] text-primary-foreground py-8 px-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profilePicture || 'https://www.w3schools.com/w3images/avatar2.png'} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <p className="text-sm text-primary-foreground/80">@{user.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <FilePenIcon className="h-6 w-6" />
              <span className="sr-only">Edit Profile</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Current Weight</Label>
              <Input id="weight" type="number" value={formData.weight} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" type="number" value={formData.height} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalType">Fitness Goal</Label>
              <Select value={formData.goalType} onValueChange={(value) => handleSelectChange('goalType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Weight Loss</SelectItem>
                  <SelectItem value="weightGain">Weight Gain</SelectItem>
                  <SelectItem value="maintainWeight">Weight Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetWeight">Target Weight</Label>
              <Input id="targetWeight" type="number" value={formData.targetWeight} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="pl-3 text-left font-normal text-muted-foreground">
                    {formData.targetDate || "Select Date"}
                    <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={formData.targetDate} onSelect={handleDateChange} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="dailyCalories">Daily Calories</Label>
              <div className="flex items-center gap-2">
                <Input id="dailyCalories" type="number" defaultValue={calories} value={calories} disabled />
                <span className="text-sm text-muted-foreground">kcal</span>
                <span className="text-sm text-muted-foreground">Intake</span>
              </div>
            </div>
          </div>
         
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
      <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Meal History</CardTitle>
                  <Select id="mealFilter" onValueChange={(val)=>handleMealRange(val)}>
                    <SelectTrigger className="w-1/3 focus:border-none">
                      <SelectValue placeholder="Filter by date"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                    </SelectContent>
                  </Select>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {meals.length ? meals.map((meal,index)=>(<div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{meal?.food?.name}</h4>
                      <p className="text-xs text-muted-foreground">{meal?.calories}</p>
                    </div>
                    <div className="text-sm font-medium">{meal?.date.split('T')[0]}</div>
                  </div>)): <div className="text-center text-3xl">No meals logged</div>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Workout History</CardTitle>
                <Select id="workoutFilter" onValueChange={(val)=>handleWorkoutRange(val)}>
                    <SelectTrigger className="w-1/3 focus:border-none">
                      <SelectValue placeholder="Filter by date"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                    </SelectContent>
                  </Select>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {workouts.length ? workouts.map((workout,index)=>(<div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{workout?.workout?.name}</h4>
                      <p className="text-xs text-muted-foreground">{workout.durationInMinutes}</p>
                    </div>
                    <div className="text-sm font-medium">{workout.date.split('T')[0]}</div>
                  </div>)) : <div className="text-center text-3xl">No workouts logged</div>}
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
  );
}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function validateFormData(formData) {
  if (!formData.weight || !formData.height || !formData.goalType || !formData.targetWeight || !formData.targetDate){ 
    toast("Please fill in all fields");
    return false;
  }
  if (formData.weight < 0 || formData.height < 0 || formData.targetWeight < 0) {
    toast("Please enter a valid number");
    return false;
  }
  if(formData.goalType === 'weight-loss' && formData.weight <= formData.targetWeight){
    toast("Target weight should be less than current weight");
    return false;
  }
  if(formData.goalType === 'weight-gain' && formData.weight >= formData.targetWeight){
    toast("Target weight should be greater than current weight");
    return false;
  }
  return true;
  
}

