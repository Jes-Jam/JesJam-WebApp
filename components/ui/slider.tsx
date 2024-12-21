"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, Fragment } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

/**
 * A component that renders a slider with the given items.
 * 
 * @param {{ items: Array<{ id: string, name: string, image: string }>}}
 * The items to render in the slider.
 * @returns {JSX.Element}
 */
const Slider = ({ items }: { items: Array<{ id: string, name: string, image: string }> }): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 1080px)": {
        slides: { perView: 3, spacing: 24 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 24 },
      },
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created() {
      setLoaded(true);
    }
  });

  return (
    <div className="relative px-4 md:px-12 py-8 group">
      <div ref={sliderRef} className="keen-slider">
        {items.map((classItem) => (
          <div key={classItem.id} className="keen-slider__slide">
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300">
              <figure className="relative w-full h-[200px] md:h-[250px] bg-sky-50">
                <Image
                  src={classItem.image || "/images/mascot.svg"}
                  alt={`${classItem.name} image`}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
                {/* Optional overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </figure>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-sky-900 capitalize">
                  {classItem.name}
                </h3>
                <p className="mt-2 text-sky-600/80 text-sm">
                  Learn everything about {classItem.name.toLowerCase()}
                </p>

                {/* Optional stats or metadata */}
                <div className="mt-4 pt-4 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-sm text-sky-600">
                    4.8 ⭐️ (127 reviews)
                  </span>
                  <span className="text-sm font-medium text-sky-700">
                    12 lessons
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <Fragment>
          {/* Navigation Buttons */}
          <button
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous Slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-sky-100 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-sky-50"
          >
            <FaChevronLeft className="w-4 h-4 text-sky-600" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            aria-label="Next Slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-sky-100 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-sky-50"
          >
            <FaChevronRight className="w-4 h-4 text-sky-600" />
          </button>

          {/* Optional: Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-sky-600 w-4' : 'bg-sky-200'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Slider;