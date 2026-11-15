import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
const path=window.location.pathname.endsWith('/')?window.location.pathname:window.location.pathname+'/';
const root=document.getElementById('root');
root.hasChildNodes()?hydrateRoot(root,<App path={path}/>):createRoot(root).render(<App path={path}/>);
