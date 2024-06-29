import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFoodsByDateRange, getUserFoods, getUserWorkouts, getWorkoutDifference, getWorkoutsByDateRange } from "@/helpers/getUserLogs"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function ProgressDashboard() {
  const {userWorkouts} = useSelector((state) => state.workouts)
  const {userFoods} = useSelector((state) => state.meals)
  const [workoutChart, setWorkoutChart] = useState('bar');
  const [mealChart, setMealChart] = useState('bar');
  const [workouts, setWorkouts] = useState([])
  const [meals, setMeals] = useState([])
  const [workoutRange, setWorkoutRange] = useState({
    start:`${new Date().toISOString().split('T')[0]}`,end:`${new Date().toISOString().split('T')[0]}`
  })
  const [foodRange, setFoodRange] = useState({
    start:`${new Date().toISOString().split('T')[0]}`,end:`${new Date().toISOString().split('T')[0]}`
  })
  const {user} = useSelector((state)=>state.user);
  const [calories, setCalories] = useState(0)
  const [caloryChange, setCaloryChange] = useState(0)
  const weightDiff = user?.weight > user?.goals?.targetWeight? `+${user?.weight-user?.goals?.targetWeight}`: `-${user?.goals?.targetWeight-user?.weight}`;
  const [workoutDiff, setWorkoutDiff] = useState(0)

  useEffect(() => {
    if(user){
    getWorkoutDifference(user?._id).then((data) => {
      setWorkoutDiff(data>0?`+${data}`:data)
    })
  }
  }, [user?._id])

  useEffect(() => {
    let totalCalories = 0;
    userFoods.forEach((meal) => {
      totalCalories += meal.calories
    })

    if(userWorkouts.length){
      userWorkouts.forEach((workout) => {
        totalCalories -= workout.caloriesBurned
      })
    }

    setCalories(totalCalories)
    const caloryDiff = user?.dailyCalorieGoal? user.dailyCalorieGoal-totalCalories:2000-totalCalories;
    
    setCaloryChange(caloryDiff>0?`+${caloryDiff} kcal`: `${caloryDiff} kcal`)
  }
  , [user,userFoods, userWorkouts]);

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8 md:py-12 lg:py-16">
        <div className="container grid gap-8 md:gap-12 lg:gap-16">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Weight</CardTitle>
                <ScaleIcon className="w-6 h-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user?.weight} kg</div>
                <p className="text-sm text-muted-foreground">{weightDiff} kg from target weight</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Calories</CardTitle>
                <FlameIcon className="w-6 h-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{calories} kcal</div>
                <p className={`text-sm text-muted-foreground`}>Goal: {user?.dailyCalorieGoal}kcal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Workouts</CardTitle>
                <DumbbellIcon className="w-6 h-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{userWorkouts.length}</div>
                <p className="text-sm text-muted-foreground text-green-500">{workoutDiff} from yesterday</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Calorie Intake</CardTitle>
                {meals.length ? <Select id="mealChart" onValueChange={(val)=>setMealChart(val)}>
                  <SelectTrigger className="w-1/3 focus:border-none">
                    <SelectValue placeholder="Select chart type"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                  </SelectContent>
                </Select>:null}
              </CardHeader>
              <CardContent>
                {meals.length ? ( mealChart==='bar' ? <BarChart className="aspect-[9/4]" meals = {meals}/>:
                <LineChart className="aspect-[9/4]" meals = {meals}/>):null}
              </CardContent>
            </Card>
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
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className='flex-row items-center justify-between'>
                <CardTitle>Workout Statistics</CardTitle>
                {workouts.length ? <Select id="workoutChart" onValueChange={(val)=>setWorkoutChart(val)}>
                  <SelectTrigger className="w-1/3 focus:border-none">
                    <SelectValue placeholder="Select chart type"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                  </SelectContent> 
                </Select>:null}
              </CardHeader>
              <CardContent>
               {workouts.length ? (workoutChart==='bar' ? <StackedbarChart className="aspect-[9/4]" workouts={workouts} />:
                <StackedLineChart className="aspect-[9/4]" workouts={workouts} />):null}
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
      </main>
    </div>
  )
}

function BarChart({ meals, ...props }) {
  const mealData = meals.map(meal => ({
    date: meal.date.split('T')[0],
    calories: meal.calories,
  }));

  return (
    <div {...props}>
      <ResponsiveBar
        data={mealData}
        keys={["calories"]}
        indexBy="date"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing calorie intake"
      />
    </div>
  );
}

function StackedbarChart({ workouts, ...props }) {
  const workoutData = workouts.map(workout => ({
    date: workout.date.split('T')[0],
    duration: workout.durationInMinutes,
    caloriesBurned: workout.caloriesBurned,
  }));

  return (
    <div {...props}>
      <ResponsiveBar
        data={workoutData}
        keys={["duration", "caloriesBurned"]}
        indexBy="date"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb", "#e11d48"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A stacked bar chart showing workout statistics"
      />
    </div>
  );
}


function DumbbellIcon(props) {
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
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  )
}


function FlameIcon(props) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}


function ScaleIcon(props) {
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
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}

function StackedLineChart({ workouts, ...props }) {
  const workoutData = [
    {
      id: "duration",
      data: workouts.map(workout => ({
        x: new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' }),
        y: workout.durationInMinutes,
      })),
    },
    {
      id: "caloriesBurned",
      data: workouts.map(workout => ({
        x: new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' }),
        y: workout.caloriesBurned,
      })),
    },
  ];

  return (
    <div {...props}>
      <ResponsiveLine
        data={workoutData}
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={10}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
        ariaLabel="A stacked line chart showing workout statistics"
      />
    </div>
  );
}

function LineChart({ meals, ...props }) {
  const mealData = [
    {
      id: "calories",
      data: meals.map(meal => ({
        x: new Date(meal.date).toLocaleDateString('en-US', { weekday: 'short' }),
        y: meal.calories,
      })),
    },
  ];

  return (
    <div {...props}>
      <ResponsiveLine
        data={mealData}
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        colors={["#2563eb"]}
        pointSize={10}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
        ariaLabel="A line chart showing calorie intake"
      />
    </div>
  );
}
