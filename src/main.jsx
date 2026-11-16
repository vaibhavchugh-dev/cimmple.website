import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import {routeFromLocation} from './paths.js';
import './styles.css';
const path=routeFromLocation(window.location.pathname);
const root=document.getElementById('root');
root.children.length>0?hydrateRoot(root,<App path={path}/>):createRoot(root).render(<App path={path}/>);
