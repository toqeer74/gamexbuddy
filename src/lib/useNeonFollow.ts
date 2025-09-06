import {useCallback} from "react";
export function useNeonFollow(){
  return useCallback((e: React.MouseEvent<HTMLElement>)=>{
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left)/rect.width)*100;
    const my = ((e.clientY - rect.top)/rect.height)*100;
    el.style.setProperty('--mx', mx+'%');
    el.style.setProperty('--my', my+'%');
  },[]);
}