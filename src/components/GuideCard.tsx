import React from "react";

export default function GuideCard({
  title, sub, href, image, sponsored
}: { title:string; sub:string; href:string; image:string; sponsored?:boolean }){
  return (
    <article className="card-glass guide-card">
      <img src={image} alt="" style={{width:"100%",height:160,objectFit:"cover"}} />
      <div style={{padding:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <h3 style={{fontWeight:800}}>{title}</h3>
          {sponsored && <span className="badge">Affiliate</span>}
        </div>
        <p style={{opacity:.85, marginTop:6}}>{sub}</p>
        <a href={href} className="nf__btn" rel="sponsored noopener" target="_blank">View Picks</a>
      </div>
    </article>
  );
}

