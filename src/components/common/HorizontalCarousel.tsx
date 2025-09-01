import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({ children, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const scrollPrev = React.useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {React.Children.map(children, (child) => (
            <div className="flex-none min-w-0 pl-4" style={{ flex: "0 0 33.3333%" }}> {/* Adjust width as needed */}
              {child}
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/70 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/70 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default HorizontalCarousel;