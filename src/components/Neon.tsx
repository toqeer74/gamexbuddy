import React from 'react';
import {useNeonFollow} from '../lib/useNeonFollow';

type NeonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
                     React.AnchorHTMLAttributes<HTMLAnchorElement> &
                     {as?: 'button'|'a', href?: string, className?: string};

export const NeonButton: React.FC<NeonButtonProps> = ({as='button', href, className='', children, ...rest})=>{
  const onMove = useNeonFollow();
  const base = "neon-follow inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-medium text-white bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/10 hover:border-white/20";
  if(as==='a' && href){
    return <a href={href} onMouseMove={onMove} className={base+" "+className} {...rest}>{children}</a>;
  }
  return <button onMouseMove={onMove} className={base+" "+className} {...rest}>{children}</button>;
};

export const NeonCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className='', children, ...rest})=>{
  const onMove = useNeonFollow();
  return <div onMouseMove={onMove} className={"neon-follow card p-4 "+className} {...rest}>{children}</div>
}

// Old neon logo (drop in your SVG at /public/logo-neon.svg)
export const LogoNeon: React.FC<{className?: string}> = ({className=''})=>(
  <img src="/Gamexbuddy-logo-v2-neon-transparent.png" alt="GameXBuddy" className={"h-8 w-auto drop-shadow-[0_0_12px_var(--gx-neon)] "+className} />
);