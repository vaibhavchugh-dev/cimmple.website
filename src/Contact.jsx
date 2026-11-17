import {withBase} from './paths.js';
import React,{useState} from 'react';
<<<<<<< HEAD
import {company} from './company.js';

const mapsEmbedSrc='https://maps.google.com/maps?q='+company.mapsLat+','+company.mapsLng+'&hl=en&z=16&output=embed';
const mapsLink='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(company.mapsQuery);

function Contact(){
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const endpoint=import.meta.env.VITE_CONTACT_ENDPOINT;
  async function submit(e){
    e.preventDefault();
    if(!endpoint)return;
    const form=e.currentTarget;
    const data=Object.fromEntries(new FormData(form));
    if(data.website)return;
    setBusy(true);
    setStatus('');
    try{
      const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!r.ok)throw Error();
      setStatus('Thank you. Your enquiry has been submitted.');
      form.reset();
    }catch{
      setStatus('Your enquiry could not be sent. Please email '+company.email+' instead.');
    }finally{
      setBusy(false);
    }
  }
  return (
    <div className="contact-page">
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="eyebrow">BOOK A WORKING CONVERSATION</p>
          <h2>What would you like to make better?</h2>
          <p>Share the process, platform, or idea you want to improve. Include your goals and the systems involved.</p>
          <p>Please avoid sharing passwords, financial account details, or sensitive personal information.</p>
          <div className="contact-steps-block">
            <p className="eyebrow">WHAT HAPPENS NEXT</p>
            <ol className="contact-steps">
              <li><strong>Review</strong><span>We read your note and confirm fit.</span></li>
              <li><strong>Conversation</strong><span>We schedule a short call or demo of our approach.</span></li>
              <li><strong>Next step</strong><span>If useful, we propose a bounded discovery with clear outcomes.</span></li>
            </ol>
          </div>
        </div>
        {endpoint?(
          <form className="contact-panel" onSubmit={submit}>
            <p className="eyebrow">SEND AN ENQUIRY</p>
            <h3>Tell us about the work</h3>
            <label>Your name<input name="name" autoComplete="name" required maxLength="120"/></label>
            <label>Work email<input name="email" autoComplete="email" type="email" required maxLength="254"/></label>
            <label>Company<input name="company" autoComplete="organization" maxLength="160"/></label>
            <label>About your project<textarea name="message" rows="5" minLength="20" maxLength="5000" required/></label>
            <label className="trap" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
            <p className="small">By submitting, you agree to the <a href={withBase('/privacy/')}>privacy notice</a>.</p>
            <button className="button" disabled={busy}>{busy?'Sending…':'Send enquiry ↗'}</button>
            <p role="status">{status}</p>
          </form>
        ):(
          <div className="contact-panel contact-reach">
            <p className="eyebrow">REACH US DIRECTLY</p>
            <h3>Start with an email</h3>
            <p>{company.responsePromise}</p>
            <a className="button" href={'mailto:'+company.email+'?subject=Book%20a%20conversation'}>Email {company.email} ↗</a>
            <div className="contact-reach-meta">
              <div>
                <span className="eyebrow">COMPANY</span>
                <p>{company.legalName}</p>
              </div>
              <div>
                <span className="eyebrow">MARKETS</span>
                <p>{company.markets}</p>
              </div>
            </div>
            <p className="small">See our <a href={withBase('/privacy/')}>privacy notice</a> for how enquiry information is handled.</p>
          </div>
        )}
      </div>

      <section className="contact-office" aria-label="Office location">
        <div className="contact-office-copy">
          <p className="eyebrow">OFFICE</p>
          <h2>Visit or find us on the map</h2>
          <address>
            {company.addressLines.map(line=><span key={line}>{line}<br/></span>)}
          </address>
          <a className="text-link" href={mapsLink} target="_blank" rel="noopener noreferrer">
            Open in Google Maps <span aria-hidden="true" className="arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 18 18 6M6 6h12v12"/></svg></span>
          </a>
        </div>
        <div className="contact-map">
          <iframe
            title={'Map showing '+company.legalName+' office'}
            src={mapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}

export default Contact;
=======
export default function Contact({partnership=false}){
 const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);
 const endpoint=import.meta.env.VITE_CONTACT_ENDPOINT;
 async function submit(e){
  e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));if(data.website)return;
  if(!endpoint){const body=Object.entries(data).filter(([k])=>k!=='website').map(([k,v])=>k+': '+v).join('\n');window.location.href='mailto:contact@cimmple.com?subject='+encodeURIComponent(partnership?'Cimmple partnership enquiry':'Cimmple discovery call enquiry')+'&body='+encodeURIComponent(body);setStatus('Your email app will open with a draft. Please send it to complete your enquiry. If it does not open, email contact@cimmple.com directly.');return}
  setBusy(true);setStatus('');try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw Error();setStatus('Thank you. Your enquiry has been submitted.');form.reset()}catch{setStatus('Your enquiry could not be sent. Please email contact@cimmple.com.')}finally{setBusy(false)}
 }
 return <div className="contact-layout"><div><p className="eyebrow">{partnership?'LET’S GROW TOGETHER':'BOOK A DISCOVERY CALL'}</p><h2>{partnership?'Tell us about your partnership idea.':'What would you like to make better?'}</h2><p>{partnership?'Share your experience, the businesses you work with, and how you would like to collaborate.':'Share your business goals, current systems, and a preferred time and time zone for a conversation. We will reply by email to arrange a call.'}</p><h3>Cimmplex Innovations LLP</h3><p>Faridabad, Haryana, India</p><p><a href="mailto:contact@cimmple.com">contact@cimmple.com</a></p><p>Please avoid sharing passwords, financial account details, or sensitive personal information.</p></div><form onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required maxLength="120"/></label><label>Work email<input name="email" autoComplete="email" type="email" required maxLength="254"/></label><label>Company<input name="company" autoComplete="organization" maxLength="160"/></label>{partnership&&<><label>Partnership type<select name="partnershipType" required defaultValue=""><option value="" disabled>Select a partnership type</option><option>Referral Partner</option><option>Sales / Business Partner</option><option>Technology Partner</option></select></label><label>LinkedIn or company website (optional)<input name="profile" type="url" placeholder="https://" maxLength="300"/></label></>}<label>{partnership?'Your experience and proposed collaboration':'About your project and preferred call time'}<textarea name="message" rows="5" minLength="20" maxLength="1500" required/></label><label className="trap" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label><p className="small">Read how enquiry information is handled in our <a href={withBase('/privacy/')}>privacy notice</a>.</p>{!endpoint&&<p className="notice">This opens a draft in your email app. Review it and send it to contact@cimmple.com.</p>}<button className="button" disabled={busy}>{busy?'Sending…':endpoint?'Send enquiry ↗':'Prepare enquiry email ↗'}</button><p role="status">{status}</p></form></div>
}
>>>>>>> 1e38c17265dd2737bb56afe2b213f81ecc960a48
