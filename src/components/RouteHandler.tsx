import React from 'react';
import { useLocation } from 'react-router-dom';
import Seo from './Seo';

const RouteHandler: React.FC = () => {
  const location = useLocation();
  const url = `https://gamexbuddy.com${location.pathname}`;
  const image = "https://gamexbuddy.com/Gamexbuddy-logo-v2-transparent.png";

  return <Seo path={location.pathname} url={url} image={image} />;
};

export default RouteHandler;