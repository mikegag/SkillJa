import '@testing-library/jest-dom';
import React, {useEffect, useState} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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


// Test cases for signup features --------------
// test('Signup form submits correctly', async () => {
//     render(<SignUp />)
// })