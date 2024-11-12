import dataStructure from "../data.json";

interface DataProps {
    data: { questionId: number; answer: string[] }[]
}

export default function FilterOnboardingData(data: DataProps["data"]) {
    const onboarding = dataStructure.onboarding
    const output: Record<string, string[] | string> = {}
    // checks first dataset answer pertaining to 'account_type' which is either an athlete or coach
    //const accountType = data[0].answer[0].slice(0,2).toLowerCase().includes('a') ? 'athlete' : 'coach';

    // if user is a coach, assign coach related onboarding schema
    // if(accountType === 'coach'){
    //     data.forEach((currResponse, index) => {
    //         output[onboarding.coach[index].property] = currResponse.answer
    //     })
    // }
    // if user is an athlete, assign athlete related onboarding schema
    // else if(accountType === 'athlete'){
    //     data.forEach((currResponse, index) => {
    //         output[onboarding.athlete[index].property] = currResponse.answer
    //     })
    // }
    // return output

    // Determine account type based on the first answer, 'athlete' or 'coach'
    const accountType = data[0].answer[0].slice(0, 2).toLowerCase().includes('a') ? 'athlete' : 'coach';

    // Set schema based on account type
    const schema = accountType === 'coach' ? onboarding.coach : onboarding.athlete;

    // Process each response based on the schema
    data.forEach((currResponse, index) => {
        const property = schema[index]?.property;
        
        if (property) {
            // Check if the property is 'account_type' or 'experience_level' and set as a single string
            if (property === "account_type" || property === "experience_level") {
                output[property] = currResponse.answer[0];
            } else {
                // Otherwise, assign the field as an array
                output[property] = currResponse.answer;
            }
        }
    });

    return output
}

