import React from "react";
import { Helmet } from "react-helmet-async";

export default function NotFound(){
  return (
    <div className="wrap" style={{ padding:"64px 20px", textAlign:"center" }}>
      <Helmet><title>404 | GameXBuddy</title></Helmet>
      <h1 className="title-xl">Lost in the neon?</h1>
      <p style={{ opacity:.85, marginTop:10 }}>That page doesn’t exist. Let’s get you back to the action.</p>
      <div style={{ marginTop:16 }}>
        <a className="btn" href="/">Go Home</a>
        <a className="btn btn--soft" href="/news" style={{ marginLeft:8 }}>Latest News</a>
      </div>
    </div>
  );
}
