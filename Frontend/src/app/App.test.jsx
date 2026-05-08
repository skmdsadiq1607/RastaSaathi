import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, test } from 'vitest';
import { store } from './store';
import App from './App';

describe('App', () => {
  test('renders RoadSoS login route', async () => {
    render(<Provider store={store}><App /></Provider>);
    expect(await screen.findByText(/RoadSoS Login/i)).toBeTruthy();
  });
});
