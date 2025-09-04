import React from "react";
import SmartImage from "@/components/SmartImage";

export default function GuideCard({
  title, sub, href, image, sponsored
}: { title:string; sub:string; href:string; image:string; sponsored?:boolean }){
  return (
    <article className="card-glass guide-card flex flex-col h-full">
      <div className="aspect-video">
        <SmartImage src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="guide__title font-bold text-lg">{title}</h3>
          {sponsored && <span className="badge">Affiliate</span>}
        </div>
        <p className="opacity-85 mt-1.5 text-sm flex-grow line-clamp-2">{sub}</p>
        <a href={href} className="nf__btn mt-3" rel="sponsored noopener" target="_blank">View Picks</a>
      </div>
    </article>
  );
}
