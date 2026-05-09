"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    alt: "Professional barber cutting hair",
    caption: "Expert Hair Styling",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    alt: "Barber trimming beard",
    caption: "Precision Beard Trimming",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    alt: "Modern barbershop interior",
    caption: "Modern Barbershop Experience",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    alt: "Barber styling hair",
    caption: "Professional Hair Care",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
    alt: "Classic haircut service",
    caption: "Classic Cuts & Styles",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80",
    alt: "Barber shop tools",
    caption: "Professional Equipment",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=800&q=80",
    alt: "Hair styling with scissors",
    caption: "Precision Cutting",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&q=80",
    alt: "Barber working on client",
    caption: "Attention to Detail",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80",
    alt: "Modern haircut style",
    caption: "Contemporary Styles",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80",
    alt: "Barbershop chair",
    caption: "Comfortable Experience",
  },
];

export default function ImageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = galleryImages.length - 1;
      if (nextIndex >= galleryImages.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our Gallery
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Experience the art of barbering through our work
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Gallery Container */}
          <div className="relative h-[350px] md:h-[450px] bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full h-full"
              >
                <img
                  src={galleryImages[currentIndex].url}
                  alt={galleryImages[currentIndex].alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Caption Overlay */}
                {galleryImages[currentIndex].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    <h3 className="text-white text-lg font-bold">
                      {galleryImages[currentIndex].caption}
                    </h3>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-3 right-3 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? "ring-3 ring-blue-500 scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Go to image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Dot Indicators (Mobile) */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
