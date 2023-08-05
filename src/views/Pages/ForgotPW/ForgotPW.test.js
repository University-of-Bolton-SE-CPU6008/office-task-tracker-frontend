import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import ForgotPW from './ForgotPW';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><ForgotPW/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
