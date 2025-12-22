import React from 'react';
import ReactDOM from 'react-dom/client';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import App from './App';

// Configure NProgress (hidden, only for internal tracking)
NProgress.configure({ 
  showSpinner: false, 
  trickleSpeed: 120,
  minimum: 0.08,
  easing: 'ease',
  speed: 400,
  parent: 'body'
});

// Start NProgress on initial paint (hidden visually)
NProgress.start();

// Complete NProgress when page is fully loaded
// Note: loaderComplete event will be dispatched by Loader component
// after the initial animation completes
window.addEventListener('load', () => {
  NProgress.done();
  // Don't dispatch loaderComplete here - let the Loader component handle it
  // after its animation completes
});

// For same-page navigations or AJAX, expose helpers
window.startLoading = () => NProgress.start();
window.stopLoading = () => NProgress.done();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

