import App from "../components/App"
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from "../utils/test-utils"

test('Uses preloaded state to render', () => {
    const initialBeer = 2
    expect(renderWithProviders(<App />, {
        preloadedState: {
            beers: {
                value: initialBeer,
                data: [
                    1,
                    2
                ],
                status: 'idle',
                error: 'none'
            }
        }
    }).store.getState()).toStrictEqual({
        "beers": {"value": 2, "data": [1,2], "status": "idle", "error": "none"}
    })
})

test('checks the welcome message', () => {
    const initialBeer = 0
    renderWithProviders(<App />, {
        preloadedState: {
            beers: {
                value: initialBeer,
                data: [
                    1,
                    2
                ],
                status: 'idle',
                error: 'none'
            }
        }
    })
    expect(screen.getByText('Welcome friend, to Beer Stats!')).toBeTruthy()
})

test('handles user input correctly', () => {
    const { getByLabelText } = renderWithProviders(<App />);
    const input = getByLabelText('What can I get ya?');

    // simulate user event 
    fireEvent.change(input, { target: { value: 'abc '} });

    // check if error state updates
    expect(screen.getByText('Sorry pal, numbers only')).toBeTruthy();
});

test('renders welcome message', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Welcome friend, to Beer Stats!')).toBeTruthy();
});
  
test('renders TextField', () => {
    renderWithProviders(<App />);
    expect(screen.getByLabelText('What can I get ya?')).toBeTruthy();
});
  
test('renders beer logo', () => {
    renderWithProviders(<App />);
    expect(screen.getByAltText('Beer logo')).toBeTruthy();
});