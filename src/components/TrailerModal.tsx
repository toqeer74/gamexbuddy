import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import trailers from '@/content/gta6/trailers.json';

interface TrailerModalProps {
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <Carousel>
          <CarouselContent>
            {trailers.map((trailer) => (
              <CarouselItem key={trailer.id}>
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailer.youtubeId}`}
                        title={trailer.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl z-10"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;
