import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { useState } from "react"

export default function CalorieCalculator() {
  const [formData,setFormData]=useState({
    age:'',
    weight:'',
    height:'',
    gender:'',
    activityLevel:'',
  })
  const [loseCalories,setLoseCalories]=useState(0)
  const [gainCalories,setGainCalories]=useState(0)
  const [maintainCalories,setMaintainCalories]=useState(0)

  const handleSubmit = (e)=>{
    e.preventDefault();
    const res = calculateCalories(formData.age,formData.weight,formData.height,formData.gender,formData.activityLevel)
    setLoseCalories(res.lose)
    setGainCalories(res.gain)
    setMaintainCalories(res.maintain)
  }

  const handleInputChange=(field,value)=>{
      setFormData((prev)=>({
        ...prev,
        [field]:value
      }))
  }
  const handleSelectChange = (field,val)=>{
    setFormData((prev)=>({
      ...prev,
      [field]:val
    }))
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-0">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Calorie Calculator</h1>
          <p className="text-muted-foreground">Enter your details to calculate your daily calorie needs.</p>
        </div>
        <form className="space-y-6 max-w-md mx-auto" onSubmit={(e)=>handleSubmit(e)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min="18" max="100" required onChange={(e)=>handleInputChange('age',e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" min="40" max="300" required onChange={(e)=>handleInputChange('weight',e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" min="100" max="250" required onChange={(e)=>handleInputChange('height',e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select id="gender" required onValueChange={(val)=>handleSelectChange('gender',val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select id="activity" required onValueChange={(val)=>handleSelectChange('activityLevel',val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentary">Sedentary</SelectItem>
                <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                <SelectItem value="Very Active">Active</SelectItem>
                <SelectItem value="Super Active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Calculate
          </Button>
        </form>
        {loseCalories || gainCalories || maintainCalories ? <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-primary text-primary-foreground shadow-lg rounded-lg w-full">
              <CardHeader>
                <CardTitle>Maintain Weight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                <p className="text-4xl font-bold">{maintainCalories} kcal</p>
                <p className="text-muted-foreground">Maintain your current weight</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground shadow-lg rounded-lg w-full">
              <CardHeader>
                <CardTitle>Weight Loss</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                <p className="text-4xl font-bold">{loseCalories} kcal</p>
                <p className="text-muted-foreground">Lose 0.5 kg per week</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500 text-green-50 shadow-lg rounded-lg w-full">
              <CardHeader>
                <CardTitle>Weight Gain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                <p className="text-4xl font-bold">{gainCalories} kcal</p>
                <p className="text-muted-foreground">Gain 0.5 kg per week</p>
              </CardContent>
            </Card>
          </div>
        </div>:null}
      </div>
    </div>
  )
}

function calculateCalories(age, weight, height, gender, activityLevel) {
  // BMR calculation using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'M') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Super Active': 1.9
  };

  const activityFactor = activityMultipliers[activityLevel];
  if (!activityFactor) {
    throw new Error("Invalid activity level input. Use one of 'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'.");
  }

  const tdee = bmr * activityFactor;

  const caloriesForLoss = tdee - 500;
  const caloriesForGain = tdee + 500;

  return {
    maintain: tdee,
    lose: caloriesForLoss,
    gain: caloriesForGain
  };
}