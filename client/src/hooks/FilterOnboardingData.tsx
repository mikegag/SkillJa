import dataStructure from "../data.json";

interface DataProps {
    data: { questionId: number; answer: string[] }[]
}

export default function FilterOnboardingData(data: DataProps["data"]) {
    const onboarding = dataStructure.onboarding
    const output: Record<string, string[] | string> = {}
    // checks first dataset answer pertaining to 'account_type' which is either an athlete or coach
    const accountType = data[0].answer[0].slice(0,2).toLowerCase().includes('a') ? 'athlete' : 'coach';

    // data.forEach((currResponse, index) => {
    //     if (onboarding.athlete[index]?.id && onboarding.athlete[index].id === currResponse.questionId) {
    //         output[onboarding.athlete[index].property] = currResponse.answer
    //     } else if (onboarding.coach[index]?.id && onboarding.coach[index].id === currResponse.questionId) {
    //         output[onboarding.coach[index].property] = currResponse.answer
    //     }
    // })

    // if user is a coach, assign coach related onboarding schema
    if(accountType === 'coach'){
        data.forEach((currResponse, index) => {
            output[onboarding.coach[index].property] = currResponse.answer
        })
    }
    // if user is an athlete, assign athlete related onboarding schema
    else if(accountType === 'athlete'){
        data.forEach((currResponse, index) => {
            output[onboarding.athlete[index].property] = currResponse.answer
        })
    }
    return output
}

