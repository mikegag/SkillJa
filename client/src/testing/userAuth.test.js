import '@testing-library/jest-dom';
import React, {useEffect, useState} from 'react';
import { render, screen, fireEvent, waitFor, logDOM } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import CreateCSFR from '../hooks/CreateCSFR';
import GetCSFR from '../hooks/GetCSFR';

// Mock axios globally for all tests
jest.mock('axios')

// Mock the CreateCSFR and GetCSFR hooks
jest.mock('../hooks/CreateCSFR', () => ({
    __esModule: true,
    default: jest.fn(() => {
        console.log('CSRF token created')
    })
}))

jest.mock('../hooks/GetCSFR', () => ({
    __esModule: true,
    default: jest.fn(() => 'mock-csrf-token')
}))

// Test cases for login features --------------
test('Login form submits correctly', async () => {
    // Mock the axios.post request
    axios.post.mockResolvedValue({ data: { success: true } })
    const createToken = CreateCSFR()
    const getToken = GetCSFR()

    render( <MemoryRouter>
                <Login />
            </MemoryRouter>
    )

    // simulate user typing into the input fields
    userEvent.type(screen.getByPlaceholderText('Email'), 'test@gmail.com')
    userEvent.type(screen.getByPlaceholderText('Password'), 'test')

    // simulate the form submission
    fireEvent.click(screen.getByText('Login'))

    // assert that the axios call was made with the correct data
    expect(axios.post).toHaveBeenCalledWith(
        'https://www.skillja.ca/login/',
        { email: 'test@gmail.com', password: 'test' },
        expect.objectContaining({
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'mock-csrf-token'  // Mocked token from GetCSFR
            },
            withCredentials: true
        })
    )
})

beforeEach(() => {
    axios.post.mockClear()
})

// Test cases for signup features --------------
test('Signup form submits correctly', async () => {
    //mock axios post request
    axios.post.mockResolvedValue({ data: { success: true} })
    const createToken = CreateCSFR()
    const getToken = GetCSFR()

    render( <MemoryRouter>
                <SignUp />
            </MemoryRouter>
    )
    //simulate form submission
    userEvent.type(screen.getByPlaceholderText('Full Name'),'test')
    userEvent.type(screen.getByPlaceholderText('Email'),'test@gmail.com')
    userEvent.type(screen.getByPlaceholderText('Password'),'test')
    userEvent.type(screen.getByPlaceholderText('Confirm Password'),'test')
    userEvent.click(screen.getByText('Next Steps'))

    // Wait for the loading animation to disappear and the next set of inputs to appear
    await waitFor(() => {
        // Check for the birthdate input to be in the document
        expect(screen.getByPlaceholderText('Date of birth (DD-MM-YYYY)')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Now we can safely interact with the next inputs
    const dateInput = screen.getByPlaceholderText('Date of birth (DD-MM-YYYY)')
    userEvent.type(dateInput, '2024-11-11')

    // Wait for and type in the phone number input
    const phoneInput = await screen.findByPlaceholderText('Phone Number (ex. 123-456-7890)')
    userEvent.type(phoneInput, '111-111-1111')

    // Wait for the gender select option to appear and select the gender
    const genderSelect = await screen.findByDisplayValue('Select Your Gender', { name: /gender/i })
    userEvent.selectOptions(genderSelect, 'Male')

    // Wait for the agreement checkbox to appear and then click
    const agreementCheckbox = await screen.findByRole('checkbox')
    userEvent.click(agreementCheckbox)

    // Wait for the Create Account button to appear and then click
    const createAccountButton = await screen.findByText('Create Account')
    await waitFor (() => {
        userEvent.click(createAccountButton)
    }, { timeout: 2200 })

    // assert that the axios call was made with the correct data
    expect(axios.post).toHaveBeenCalledWith(
        'https://www.skillja.ca/signup/',
        {fullname: 'test', 
            email: 'test@gmail.com', 
            password: 'test',
            confirmpassword: 'test',
            date: '2024-11-11',
            phonenumber: '111-111-1111',
            gender: 'male'
        },
        expect.objectContaining({
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'mock-csrf-token'  // Mocked token from GetCSFR
            },
            withCredentials: true
        })
    )

})