import { screen } from '@testing-library/react';
import ErrorPage from '../routes/error-page';
import { renderWithProviders } from '../utils/test-utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteError: () => ({
    statusText: 'Not Found',
    message: 'Page not found'
  }),
}));

describe('ErrorPage component', () => {
  it('renders error page with message', () => {
    renderWithProviders(<ErrorPage />);
    expect(screen.getByText('Oops!')).toBeTruthy();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeTruthy();
    expect(screen.getByText(/Not Found/i)).toBeTruthy();
  });
});
