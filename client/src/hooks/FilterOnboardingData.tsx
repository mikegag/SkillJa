import dataStructure from "../data.json";

interface DataProps {
    data: { questionId: number; answer: string[] }[]
}

export default function FilterOnboardingData(data: DataProps["data"]) {
    const onboarding = dataStructure.onboarding
    const output: Record<string, string[] | string> = {}

    data.forEach((currResponse, index) => {
        if (onboarding.athlete[index]?.id && onboarding.athlete[index].id === currResponse.questionId) {
            output[onboarding.athlete[index].property] = currResponse.answer
        } else if (onboarding.coach[index]?.id && onboarding.coach[index].id === currResponse.questionId) {
            output[onboarding.coach[index].property] = currResponse.answer
        }
    })

    return output
}

