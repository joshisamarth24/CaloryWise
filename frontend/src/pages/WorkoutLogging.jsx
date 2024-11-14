import { useState } from "react"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { backendUrl } from "@/Constants"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { addWorkout, removeWorkout } from "@/redux/workoutSlice"


export default function WorkoutLogging() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("")
  const {user} = useSelector((state)=>state.user);
  const [workouts, setWorkouts] = useState([])
  const [noResultsShown,setNoResultsShown] = useState(false);
  const {userWorkouts} = useSelector((state)=>state.workouts);
  const [dbWorkouts, setDbWorkouts] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: '',
    wrokoutId: '',
  })

  const handleDeleteWorkout = async(workout) => {
    try {
      const res = await fetch(`${backendUrl}/workouts/logs/${workout._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res.status === 204) {
        toast.success("Workout deleted successfully")
        dispatch(removeWorkout(workout._id));
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleSearch = async (e) => {
    const query = e.target.value;
    if (query.length < 1) {
      setSearchQuery("");
      setDbWorkouts([]);
      setNoResultsShown(false);
      return;
    }
  
    setSearchQuery(query);
    setDbWorkouts([]);
  
    try {
      const res = await fetch(`${backendUrl}/workouts/search?query=${query}`);
      const data = await res.json();
      setDbWorkouts(data);
  
      if (data.length === 0 && !noResultsShown) {
        toast.error("No workouts found, please add it manually");
        setNoResultsShown(true); 
      } else if (data.length > 0) {
        setNoResultsShown(false);
      }
  
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch workouts, please try again");
    }
  };


  const handleWorkoutChange = (field, value) => {
    setNewWorkout((prevWorkout) => ({
      ...prevWorkout,
      [field]: value,
    }))
  }

  const handleSelectWorkout = (workout) => {
    setNewWorkout({
      name: workout.name,
      workoutId: workout._id,
    })
    if(newWorkout.duration){
      setCaloriesBurned(workout.caloriesBurnedPerMinute * newWorkout.duration)
    }
  }


  const handleAddWorkout = async() => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, {...newWorkout,calories:caloriesBurned}])
    setNewWorkout({
      name: "",
      duration: '',
      workoutId: '',
    })
    setCaloriesBurned('');
    try {
      const res = await fetch(`${backendUrl}/workouts/log/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newWorkout.name,
          durationInMinutes: newWorkout.duration,
          caloriesBurned: caloriesBurned,
        }),
      })
      const data = await res.json();
      if (res.status === 201) {
        toast.success("Workout added successfully")
        dispatch(addWorkout(data));
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const filteredWorkouts = workouts.filter((workout) => workout.name.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </div>
      {dbWorkouts.length ? <div className="grid grid-cols-1 mb-6">
      <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dbWorkouts?.map((workout, index) => (
                <div key={index} className="flex justify-between items-center bg-muted p-4 rounded-md">
                  <div>
                    <div className="font-medium">{workout?.name}</div>
                    <div className="text-muted-foreground">
                      {workout?.caloriesBurnedPerMinute} calories(calories burned per minute)
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleSelectWorkout(workout)}>
                    <PlusIcon className="w-5 h-5" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>:null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log a Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => handleWorkoutChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => handleWorkoutChange("duration", Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddWorkout}>Add Workout</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Logged Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userWorkouts.length ? (userWorkouts?.map((workout, index) => (
                <div key={index} className="flex justify-between items-center bg-muted p-4 rounded-md">
                  <div>
                    <div className="font-medium">{workout?.workout?.name}</div>
                    <div className="text-muted-foreground">
                      {workout.durationInMinutes} minutes | {workout.caloriesBurned} calories
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={()=>handleDeleteWorkout(workout)}>
                    <TrashIcon className="w-5 h-5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))):<div className="text-muted-foreground">No workouts logged yet</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
function PlusIcon(props) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
