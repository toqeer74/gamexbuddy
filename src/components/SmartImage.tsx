import React, { useState } from "react";

export default function SmartImage({ src, alt, className, style, fallback }:{ src?: string; alt?: string; className?: string; style?: React.CSSProperties; fallback?: string }){
  const [ok, setOk] = useState(true);
  const show = ok && src ? src : (fallback || "/placeholder.svg");
  return (
    <img
      src={show}
      alt={alt || 'image'}
      className={className}
      style={style}
      onError={()=> setOk(false)}
      loading="lazy"
    />
  );
}

