import React,{useState} from 'react';
import {company,mapsEmbedSrc} from './company.js';

// The Google map is third-party content, so it loads only after the visitor chooses to show it.
export default function MapEmbed(){
  const [show,setShow]=useState(false);
  if(show)return <iframe title={'Map showing '+company.legalName+' office'} src={mapsEmbedSrc} referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>;
  return (
    <div className="map-consent">
      <span className="tile-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
      </span>
      <p>The map is provided by Google Maps and loads only if you choose to show it.</p>
      <button type="button" className="button" onClick={()=>setShow(true)}>Show map</button>
    </div>
  );
}
