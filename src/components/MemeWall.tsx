import React, { useState } from "react";

type Post = { id:string; title:string; image:string; likes:number };

const START: Post[] = [
  { id:"1", title:"My face when the patch drops…", image:"https://images.unsplash.com/photo-1519659528534-7fd733a832a0?q=80&w=1600&auto=format&fit=crop", likes:12 },
  { id:"2", title:"Let’s discuss crossplay settings", image:"https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop", likes:4 },
  { id:"3", title:"How well do you know GTA lore?", image:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop", likes:20 }
];

export default function MemeWall(){
  const [posts,setPosts] = useState<Post[]>(START);
  const like = (id:string)=> setPosts(ps=> ps.map(p => p.id===id ? {...p, likes:p.likes+1}:p));

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h2">From Our Community</h2>
        <div className="wall-grid">
          {posts.map(p=> (
            <figure key={p.id} className="wall-card">
              <img src={p.image} alt={p.title}/>
              <figcaption className="p">
                <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
                <button onClick={()=>like(p.id)} className="nf__btn" style={{padding:"6px 10px",fontSize:12}}>❤️ {p.likes}</button>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

