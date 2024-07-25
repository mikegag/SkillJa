import React from "react";

interface GoalProp {
    goal: string
}
export default function CurrentGoal({goal}:GoalProp){
    return (
        <div className="rounded-xl bg-main-white border text-center py-2 px-4 my-2">
            <p className="text-center">{goal}</p>
        </div>
    )
}