import React, {useState} from 'react';
import {LogoNeon, NeonButton} from './Neon';

const MenuGroup: React.FC<{label:string, items:{label:string, href:string, tag?:string}[]}> = ({label, items})=>{
  const [open,setOpen]=useState(false);
  return (
    <div className="relative" onMouseLeave={()=>setOpen(false)}>
      <button onMouseEnter={()=>setOpen(true)} onClick={()=>setOpen(v=>!v)} className="px-3 py-2 text-sm text-white/90 hover:text-white">
        {label}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 card p-2">
          {items.map((it)=> (
            <a key={it.href} href={it.href} className="neon-follow block px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white" onMouseMove={(e)=>{
              const el=e.currentTarget as HTMLElement; const rect=el.getBoundingClientRect(); el.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+"%"); el.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+"%");
            }}>
              <span className="flex items-center justify-between">
                <span>{it.label}</span>
                {it.tag && <span className="text-[10px] uppercase tracking-wider text-white/60">{it.tag}</span>}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<{onLogin?:()=>void, isAuthed?:boolean}> = ({onLogin, isAuthed})=>{
  return (
    <header className="sticky top-0 z-50 nav-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <LogoNeon/>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          <MenuGroup label="Games" items={[
            {label:'Game Database', href:'/games'},
            {label:'Deals', href:'/deals'},
            {label:'Marketplace', href:'/market'}] } />
          <MenuGroup label="Community" items={[
            {label:'Forum', href:'/forum'},
            {label:'Clans', href:'/clans'},
            {label:'Leaderboards', href:'/leaderboards'}] } />
          <MenuGroup label="Esports" items={[
            {label:'Tournaments', href:'/tournaments'},
            {label:'Live Streams', href:'/live'}] } />
          <MenuGroup label="GTA6 Hub" items={[
            {label:'Overview', href:'/gta6'},
            {label:'News', href:'/gta6/news'}] } />
          <a href="/news" className="px-3 py-2 text-sm text-white/90 hover:text-white">News</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Single login button replacing duplicates */}
          <NeonButton onClick={onLogin} as="button" className="hidden sm:inline-flex">{isAuthed? 'Account' : 'Sign in'}</NeonButton>
          <button className="md:hidden p-2" aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
};