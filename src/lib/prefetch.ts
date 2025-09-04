export function prefetch(url: string){
  const link = document.createElement("link");
  link.rel = "prefetch"; link.href = url; document.head.appendChild(link);
}
export function prefetchOnIdle(urls: string[]){
  if ("requestIdleCallback" in window){
    (window as any).requestIdleCallback(()=> urls.forEach(prefetch));
  } else {
    setTimeout(()=> urls.forEach(prefetch), 1200);
  }
}

