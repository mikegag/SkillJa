import React, { useEffect, useState } from "react";
import runnerIcon from '../../../assets/icons/runner.svg';
import tennisIcon from '../../../assets/icons/tennis.svg';
import golfIcon from '../../../assets/icons/golf.svg';
import soccerIcon from '../../../assets/icons/soccer.svg';

interface DropDownProps {
    useCase: 'sport' | 'location' | 'price';
    onSportSelect?: (sport: string) => void;
    onLocationChange?: (value: number) => void;
    onPriceChange?: (min: number, max: number) => void;
}

//interface above needs to be updated to have callback functions for each dropdown type
export default function DropDown({useCase, onSportSelect, onLocationChange, onPriceChange}:DropDownProps){
    const [selectedValue, setSelectedValue] = useState<string | null>(null)
    const [minValue, setMinValue] = useState(25)
    const [maxValue, setMaxValue] = useState(50)
    const minGap = 20
    const minRange = 0
    const maxRange = 100
    const photo = require('../../../assets/icons/runner.svg');

    //Handles the change event for the minimum range slider (left positioned slider)
    function handleMinChange(e: React.ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value + minGap <= maxValue) {
            setMinValue(value)
            if (onPriceChange) onPriceChange(value, maxValue)
        }
    }

    //Handles the change event for the maximum range slider (right positioned slider)
    function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value - minGap >= minValue) {
            setMaxValue(value)
            if (onPriceChange) onPriceChange(minValue, value)
        }
    }

    // Handles the change event for the location slider
     function handleLocationChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (onLocationChange) onLocationChange(value);
    }

    // General click handler for sport images
    const handleSportClick = (id: string) => {
        setSelectedValue(id);
        if (onSportSelect) onSportSelect(id);
    }

    //returns left position of slider to update background color
    const getLeftPosition = () => {
        return ((minValue - minRange) / (maxRange - minRange)) * 100;
    }
     //returns right position of slider to update background color
    const getRightPosition = () => {
        return ((maxValue - minRange) / (maxRange - minRange)) * 100;
    }

    return (
        <div>
            {useCase === "sport" ? 
                <div className="absolute rounded-2xl bg-main-white border mt-6 -ml-4 border-main-grey-100 shadow-lg flex flex-wrap w-60 justify-center items-center py-2 px-0">
                    <p className="my-1 w-full text-sm text-center font-kulim">
                        Suggested Sports...
                    </p>
                    <img 
                        id="Golf"
                        alt="golf icon from https://iconscout.com/contributors/christian-mohr"
                        className="w-24 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                        src={golfIcon}
                        onClick={() => handleSportClick('Golf')}
                    />
                    <img 
                        id="Soccer"
                        alt="soccer icon from https://iconscout.com/contributors/christian-mohr"
                        className="w-24 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                        src={soccerIcon}
                        onClick={() => handleSportClick('Soccer')}
                    />
                    <img 
                        id="Running"
                        alt="running icon from https://iconscout.com/contributors/christian-mohr"
                        className="w-24 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                        src={runnerIcon}
                        onClick={() => handleSportClick('Running')}
                    />
                    <img 
                        id="Tennis"
                        alt="tennis icon from https://iconscout.com/contributors/christian-mohr"
                        className="w-24 m-1.5 rounded-xl p-1 border border-main-grey-100 hover:border-main-green-500 hover:shadow-md"
                        src={tennisIcon}
                        onClick={() => handleSportClick('Tennis')}
                    />
                </div>
            :
                (useCase === "location" ? 
                    <div className="absolute rounded-2xl bg-main-white border mt-6 -ml-4 border-main-grey-100 shadow-lg flex flex-col w-60 justify-center items-center p-3">
                        <div className="flex justify-center items-center text-sm w-full mb-1">
                            <p className="ml-0 mr-auto">
                                0 km
                            </p>
                            <p className="mx-auto">
                                25 km
                            </p>
                            <p className="ml-auto mr-0">
                                50 km
                            </p>
                        </div>
                        <input 
                            type="range" 
                            name="location" 
                            min="0" 
                            max="50" 
                            step="5" 
                            className="slider"
                            onChange={handleLocationChange}
                        >
                        </input>
                    </div>
                :
                    <div className="absolute rounded-2xl bg-main-white border mt-12 -ml-4 border-main-grey-100 shadow-lg flex flex-col w-56 justify-center items-center p-3">
                        <div className="flex justify-center items-center text-main-grey-200 text-sm w-full mb-4">
                            <p className="mr-auto">
                                $
                                <span className="text-main-green-900"> 
                                    $$$
                                </span>
                            </p>
                            <p className="mx-auto ">
                                $$
                                <span className="text-main-green-900"> 
                                    $$
                                </span>
                            </p>
                            <p className="mx-auto ">
                                $
                                <span className="text-main-green-900"> 
                                    $$$
                                </span>
                            </p>
                            <p className="ml-auto text-main-green-900">
                                $$$$
                            </p>
                        </div>
                        <div className="range-slider-container pb-5">
                            <div
                                className="range-slider-fill"
                                style={{
                                    left: `${getLeftPosition()}%`,
                                    width: `${getRightPosition() - getLeftPosition()}%`
                                }}
                            ></div>
                            <input
                                type="range"
                                min={minRange}
                                max={maxRange}
                                value={minValue}
                                onChange={handleMinChange}
                                className="range-slider range-slider-1"
                            />
                            <input
                                type="range"
                                min={minRange}
                                max={maxRange}
                                value={maxValue}
                                onChange={handleMaxChange}
                                className="range-slider range-slider-2"
                            /> 
                        </div>
                    </div>
                )}
        </div>

    )
}