import React, { useEffect, useState } from "react";
import dataStructure from "../data.json";

interface DataProps {
    data: { questionId: number; answer: string[] }[]
}

export default function FilterOnboardingData({ data }: DataProps) {
    const [formattedOutput, setFormattedOutput] = useState<Record<string, string[] | string>>({})

    useEffect(() => {
        formatOutput()
    }, [data])
    //formats frontend responses to match backend schema
    function formatOutput() {
        const onboarding = dataStructure.onboarding
        const sports = dataStructure.onboarding.sports
        const accountTypes = dataStructure.onboarding.accountTypes
        
        const output: Record<string, string[] | string> = {}

        data.forEach((currResponse, index) => {
            if (onboarding.athlete[index]?.id && onboarding.athlete[index].id === currResponse.questionId) {
                let modifiedAnswers: string[] = []
                //removes emojis from answers
                if (currResponse.answer.some((ans) => sports.includes(ans)) || currResponse.answer.some((ans) => accountTypes.includes(ans))) {
                    modifiedAnswers = currResponse.answer.map((ans) => ans.slice(0, ans.length - 2).trim())
                    output[onboarding.athlete[index].property] = modifiedAnswers
                } else {
                    output[onboarding.athlete[index].property] = currResponse.answer
                }
            } else if (onboarding.coach[index]?.id && onboarding.coach[index].id === currResponse.questionId) {
                output[onboarding.coach[index].property] = currResponse.answer
            }
        })
        setFormattedOutput(output)
    }

    return (
        <pre>{JSON.stringify(formattedOutput, null, 2)}</pre>
    )
}
