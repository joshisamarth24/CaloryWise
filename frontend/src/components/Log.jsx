import React from 'react'

const Log = ({heading,type,date,calories}) => {
  return (
    <div className="flex items-center justify-between">
    <div>
      <h4 className="font-medium">Grilled Chicken Salad</h4>
      <p className="text-sm text-muted-foreground">Lunch - June 22, 2023</p>
    </div>
    <div className="text-right">
      <p className="font-medium">450 calories</p>
      <p className="text-sm text-muted-foreground">Protein: 40g, Carbs: 20g, Fat: 15g</p>
    </div>
  </div>
  )
}

export default Log