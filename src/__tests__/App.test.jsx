import React from 'react';
import { render } from '@testing-library/react';

// Simple test to verify Jest is working
test('Jest is working correctly', () => {
  expect(true).toBe(true);
});

test('Math operations work', () => {
  expect(2 + 2).toBe(4);
  expect(5 * 3).toBe(15);
});

// Test React rendering
test('can render a simple component', () => {
  const TestComponent = () => <div>Hello Jest!</div>;
  const { getByText } = render(<TestComponent />);
  expect(getByText('Hello Jest!')).toBeInTheDocument();
});
