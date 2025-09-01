import React from "react";

interface TrailerEmbedProps {
  youtubeId: string;
  title: string;
}

const TrailerEmbed: React.FC<TrailerEmbedProps> = ({ youtubeId, title }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ paddingTop: "56.25%" }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TrailerEmbed;