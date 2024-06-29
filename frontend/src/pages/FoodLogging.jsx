import { useEffect, useState } from "react"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import toast from "react-hot-toast"
import { backendUrl } from "@/Constants"
import { useDispatch, useSelector } from "react-redux"
import { addMeal, removeMeal } from "@/redux/mealSlice"

export default function FoodLogging() {
  const {user} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const {userFoods} = useSelector((state)=>state.meals);
  const [searchQuery, setSearchQuery] = useState("")
  const [meals, setMeals] = useState([])
  const [dbMeals, setDbMeals] = useState([])
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "",
    quantity: '',
    calories: '',
    foodId: "",
  })



  const handleDeleteLog = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/foods/logs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })  
      if (res.status === 204) {
        toast.success("Meal deleted successfully")
        dispatch(removeMeal(id));
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value)
    if(searchQuery.length >= 1){
    try {
      const res = await fetch(`${backendUrl}/foods/searchFoods?query=${searchQuery}`)
      const data = await res.json()
      setDbMeals(data)
      if (data.length === 0) {
        toast.error("No meals found, please add it manually")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to find meals, please add it manually")
    }
  }
  }

  const handleMealChange = (field, value) => {
    setNewMeal((prevMeal) => ({
      ...prevMeal,
      [field]: value,
    }))
  }

  const handleAddMeal = async() => {
    setMeals((prevMeals) => [...prevMeals, newMeal])
    try {
      const res = await fetch(`${backendUrl}/foods/log/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeal),
      })
      const data = await res.json()
      if (res.status === 201) {
        toast.success("Meal added successfully")
        dispatch(addMeal(data));
      }
    } catch (error) {
      console.log(error)
    }
    setNewMeal({
      name: "",
      type: "",
      quantity: '',
      calories: '',
      foodId: "",
    })
  }

  const handleSelectMeal = (meal) => {
    setNewMeal({
      name: meal.name,
      type: meal.type,
      quantity: meal.quantity,
      calories: meal.calories,
      foodId: meal._id,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </div>
      {dbMeals.length ? <div className="grid grid-cols-1">
      <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dbMeals.map((meal, index) => (
                <div key={index} className="flex justify-between items-center bg-muted p-4 rounded-md">
                  <div>
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-muted-foreground">
                      {meal.type} | {meal.quantity} | {meal.calories} calories
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleSelectMeal(meal)}>
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
            <CardTitle>Log a Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => handleMealChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="meal-type">Meal Type</Label>
                <Input
                  id="meal-type"
                  type="text"
                  value={newMeal.type}
                  onChange={(e) => handleMealChange("type", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newMeal.quantity}
                  onChange={(e) => handleMealChange("quantity", Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => handleMealChange("calories", Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddMeal}>Add Meal</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Logged Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userFoods.length ? userFoods?.map((meal, index) => (
                <div key={index} className="flex justify-between items-center bg-muted p-4 rounded-md">
                  <div>
                    <div className="font-medium">{meal?.food?.name}</div>
                    <div className="text-muted-foreground">
                      {meal.mealType} | {meal.quantity} | {meal.calories} calories | {(meal.date).split('T')[0]}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={()=>handleDeleteLog(meal._id)}>
                    <TrashIcon className="w-5 h-5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )):
              <div className="text-muted-foreground">
                No meals logged yet
                </div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
