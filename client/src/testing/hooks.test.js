import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import UseWindowSize from '../hooks/GetWindowSize';

function TestWindowComponent(){
    const size = UseWindowSize()
    return <div data-testid="usewindowsize">{JSON.stringify(size)}</div>
}

test("gets the current window size of the user's browser",()=>{
    const { getByTestId } = render(<TestWindowComponent />)
    expect(getByTestId('usewindowsize').textContent).toBe(JSON.stringify({ width: window.innerWidth, height: window.innerHeight }))
})

