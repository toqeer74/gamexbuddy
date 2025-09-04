import React from 'react';
import { useLocation } from 'react-router-dom';
import Seo from './Seo';
import { Helmet } from 'react-helmet-async';

const RouteHandler: React.FC = () => {
  const location = useLocation();
  const url = `https://gamexbuddy.com${location.pathname}`;
  const image = "https://gamexbuddy.com/Gamexbuddy-logo-v2-neon-transparent.png";

  return (
    <>
      <Helmet>
        <title>GameXBuddy – Gaming Hub</title>
        <meta name="description" content="News, guides, tools, wallpapers and community across top games." />
        <meta property="og:title" content="GameXBuddy – Gaming Hub" />
        <meta property="og:description" content="News, guides, tools, wallpapers and community across top games." />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
      </Helmet>
      <Seo path={location.pathname} url={url} image={image} />
    </>
  );
};

export default RouteHandler;
