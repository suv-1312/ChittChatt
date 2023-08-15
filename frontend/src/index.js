// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import { ChakraProvider } from '@chakra-ui/react';
// // import { BrowserRouter } from 'react-router-dom';

// ReactDOM.render(
//   <React.StrictMode>
//     <ChakraProvider>
//       <App />
//     </ChakraProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );


import { createRoot } from 'react-dom/client';
import App from './App.js';
import { ChakraProvider } from '@chakra-ui/react';
const root = createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);