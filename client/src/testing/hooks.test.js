import '@testing-library/jest-dom';
import React, {useEffect, useState} from 'react';
import { render, waitFor } from '@testing-library/react';
import UseWindowSize from '../hooks/general/GetWindowSize';
import CreateCSFR from '../hooks/userAuthentication/CreateCSFR';
import GetCSFR from '../hooks/userAuthentication/GetCSFR';
import FilterOnboardingData from '../hooks/FilterOnboardingData';
import axios from 'axios';

// Mock axios globally for all tests
jest.mock('axios')

// test component used for UseWindowSize tests -----------
function TestWindowComponent(){
    const size = UseWindowSize()
    return <div data-testid="usewindowsize">{JSON.stringify(size)}</div>
}

test("gets the current window size of the user's browser",()=>{
    const { getByTestId } = render(<TestWindowComponent />)
    expect(getByTestId('usewindowsize').textContent).toBe(JSON.stringify({ width: window.innerWidth, height: window.innerHeight }))
})


// Test component used for CreateCSRF tests ------------
function TestCSFRWindow() {
    const token = CreateCSFR({ name: 'csfrToken' })
    return <div data-testid="csfr-token">{token}</div>
}

test("creates a CSRF token within the browser's cookies", async () => {
    // Mock axios GET request
    axios.get.mockResolvedValue({
        data: { csrfToken: 'mocked-csrf-token' }
    })

    const { getByTestId } = render(<TestCSFRWindow />)
    
    await waitFor(() => {
        const csfrTokenElement = getByTestId('csfr-token')
        expect(csfrTokenElement.textContent).toBe('mocked-csrf-token')
    })
})


// Test component used for GetCSFR tests ------------
function TestGetCSFRWindow() {
    const mockToken = CreateCSFR({ name: 'csfrToken' })
    const tokenValue = GetCSFR({name:'csfrToken'})
    return <div data-testid="csfr-token">{tokenValue}</div>
}

test("retrieves a CSFR token within the browser's cookies", () => {
    // Mock the document.cookie to include the CSRF token
    document.cookie = "csfrToken=mocked-csrf-token; path=/"

    // Render the component
    const { getByTestId } = render(<TestGetCSFRWindow />)

    // Get the token value directly from cookies
    const tokenValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csfrToken='))
        ?.split('=')[1]

    // Assert that the component renders the expected token
    expect(getByTestId('csfr-token').textContent).toBe(tokenValue)
})


// Test component used for FilterOnboardingDat tests ------------
function TestFilterOnboardingData() {
    // mock data for onboarding a user who identifies as an athlete
    const mockAthleteData = {
        data: [{questionId: 1, answer: "athlete"},
                {questionId: 2, answer:["soccer","football"]},
                {questionId: 3, answer:"beginner"},
                {questionId: 4, answer:["run faster"]}
        ]
    }
    // mock data for onboarding a user who identifies as a coach
    const mockCoachData = {
        data: [{questionId: 1, answer: "coach"},
                {questionId: 2, answer:"3+ years"},
                {questionId: 3, answer:["kids","adults"]},
                {questionId: 4, answer:["golf"]}
        ]
    }
    // filter mock datasets using related onboarding hook
    const FilterAthleteData = FilterOnboardingData(mockAthleteData.data)
    const FilterCoachData = FilterOnboardingData(mockCoachData.data)

    return <div>
        <div data-testid="athlete-data">{JSON.stringify(FilterAthleteData)}</div>
        <div data-testid="coach-data">{JSON.stringify(FilterCoachData)}</div>
    </div>
}

test("filters mock data when onboarding an athlete", () => {
    // mock data for onboarding a user who identifies as an athlete
    const mockData = {
        account_type: "athlete",
        sport_interests:["soccer","football"],
        experience_level:"beginner",
        goals:["run faster"]
    }
    const {getByTestId} = render(<TestFilterOnboardingData />)
    expect(getByTestId('athlete-data').textContent).toBe(JSON.stringify({
        account_type: "athlete",
        sport_interests: ["soccer","football"],
        experience_level: "beginner",
        goals: ["run faster"]
    }))
})

test("filters mock data when onboarding an coach", () => {
    // mock data for onboarding a user who identifies as a coach
    const mockData = {
        account_type: "coach",
        experience_level:"3+ years",
        age_groups:["kids","adults"],
        specialization:["golf"]
    }
    const {getByTestId} = render(<TestFilterOnboardingData />)
    expect(getByTestId('coach-data').textContent).toBe(JSON.stringify({
        account_type: "coach",
        experience_level:"3+ years",
        age_groups:["kids","adults"],
        specialization:["golf"]
    }))
        
})