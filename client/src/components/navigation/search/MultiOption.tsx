import React from "react"
import runnerIcon from '../../../assets/icons/runner.svg';
import tennisIcon from '../../../assets/icons/tennis.svg';
import golfIcon from '../../../assets/icons/golf.svg';
import soccerIcon from '../../../assets/icons/soccer.svg';

interface SliderProps {
    onSportSelect?: (sport: string) => void;
}

export default function MultiOption({onSportSelect}:SliderProps){
    // General click handler for sport images
    const handleSportClick = (id: string) => {
        if (onSportSelect) onSportSelect(id)
    }

    return (
        <>
            <div className="mt-2 flex flex-wrap justify-center items-center py-2 px-0">
                <p className="my-1 w-full text-sm text-center font-kulim">
                    Suggested Sports...
                </p>
                <img 
                    id="Golf"
                    alt="golf icon from https://iconscout.com/contributors/christian-mohr"
                    className="w-16 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                    src={golfIcon}
                    onClick={() => handleSportClick('Golf')}
                />
                <img 
                    id="Soccer"
                    alt="soccer icon from https://iconscout.com/contributors/christian-mohr"
                    className="w-16 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                    src={soccerIcon}
                    onClick={() => handleSportClick('Soccer')}
                />
                <img 
                    id="Running"
                    alt="running icon from https://iconscout.com/contributors/christian-mohr"
                    className="w-16 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                    src={runnerIcon}
                    onClick={() => handleSportClick('Running')}
                />
                <img 
                    id="Tennis"
                    alt="tennis icon from https://iconscout.com/contributors/christian-mohr"
                    className="w-16 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                    src={tennisIcon}
                    onClick={() => handleSportClick('Tennis')}
                />
            </div>
        </>
    )
}