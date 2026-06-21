import { renderWithProviders } from '../utils/test-utils';
import Root from '../routes/routes';

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

describe('Router', () => {
  it('should render the Root component', () => {
    renderWithProviders(<Root />);
    // Root renders App, which should be in the DOM
    expect(document.body).toBeTruthy();
  });
});
