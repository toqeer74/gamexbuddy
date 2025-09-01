import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function NewsTagChips({ tags }: { tags: string[] }) {
  const location = useLocation();
  const current = decodeURIComponent(location.pathname.replace(/^.*\/tag\//, ""));
  const isAll = location.pathname.endsWith("/news");

  return (
    <div className="chips">
      <NavLink to="/news" className={({isActive}) => `chip ${isAll || isActive ? "chip--on" : ""}`}>
        <span className="chip__dot" />
        All
      </NavLink>
      {tags.map((t) => (
        <NavLink
          key={t}
          to={`/news/tag/${encodeURIComponent(t)}`}
          className={({isActive}) => `chip ${(!isAll && (isActive || current===t)) ? "chip--on" : ""}`}
        >
          <span className="chip__dot" />
          {t}
        </NavLink>
      ))}
    </div>
  );
}

