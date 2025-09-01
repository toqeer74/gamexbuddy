import React from "react";
export default function PCCheckerCard(){
  return (
    <div className="card-glass" style={{padding:18}}>
      <div className="badge">🖥️ Tool</div>
      <h3 style={{fontWeight:800, marginTop:6}}>PC Checker (Coming Soon)</h3>
      <p style={{opacity:.85}}>Check if your rig is ready for the next big title.</p>
      <ul style={{opacity:.8, fontSize:14, marginTop:6, lineHeight:1.6}}>
        <li>CPU: Intel i5-6600K / Ryzen 5 1600</li>
        <li>GPU: GTX 1060 / RX 580</li>
        <li>RAM: 8 GB</li>
        <li>Storage: 150 GB SSD</li>
      </ul>
    </div>
  );
}

