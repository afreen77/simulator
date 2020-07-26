import React from 'react';
import { render } from '@testing-library/react';
import { ControlPanel} from "./app/components";

test('renders Control Panel Left Button', () => {
  const handleCommand= () => jest.fn;
  const { getByTestId } = render(<ControlPanel handleCommand={() => handleCommand}  />);
  const LeftIcon = getByTestId('left');
  expect(LeftIcon).toBeInTheDocument();
});
