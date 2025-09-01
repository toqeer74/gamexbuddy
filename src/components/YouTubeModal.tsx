import React from "react";

export default function YouTubeModal({
  open,
  title,
  youtubeId,
  onClose,
}: {
  open: boolean;
  title: string;
  youtubeId: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="ytm" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="ytm__panel" onClick={(e) => e.stopPropagation()}>
        <button className="ytm__close" aria-label="Close" onClick={onClose}>✕</button>
        <div className="ytm__ratio">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

