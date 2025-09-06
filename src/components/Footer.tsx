import React from 'react';
import {LogoNeon} from './Neon';

const socials = [
  {name:'YouTube', href:'https://youtube.com', color:'#FF0033', svg:(<path d="M10 15l5.19-3L10 9v6z"/>), viewBox:'0 0 24 24'},
  {name:'Twitter/X', href:'https://x.com', color:'#fff', svg:(<path d="M4 4l16 16M20 4L4 20"/>), viewBox:'0 0 24 24'},
  {name:'Instagram', href:'https://instagram.com', color:'#E4405F', svg:(<path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm9 4h.01M12 8a4 4 0 100 8 4 4 0 000-8z"/>), viewBox:'0 0 24 24'},
  {name:'Reddit', href:'https://reddit.com', color:'#FF4500', svg:(<g><circle cx="12" cy="12" r="3"/><circle cx="19" cy="13" r="1"/><circle cx="5" cy="13" r="1"/><path d="M16 16a6 6 0 01-8 0"/></g>), viewBox:'0 0 24 24'},
  {name:'Twitch', href:'https://twitch.tv', color:'#9146FF', svg:(<path d="M4 4h16v9l-4 4H12l-3 3v-3H6V4zM14 8v4M10 8v4"/>), viewBox:'0 0 24 24'},
];

export const Footer: React.FC = ()=>{
  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <LogoNeon className="h-9"/>
          <p className="text-white/70 max-w-md">The ultimate gaming platform with database, live streams, community features, and AI-powered gaming assistance.</p>
        </div>
        <div className="md:justify-self-end flex items-center gap-5">
          {socials.map(s=> (
            <a key={s.name} aria-label={s.name} href={s.href} className="icon-hover" style={{color:s.color}}>
              <svg width="26" height="26" viewBox={s.viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {s.svg}
              </svg>
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-white/50">© 2025 GameXBuddy. Made with ❤ for gamers worldwide.</div>
    </footer>
  );
};