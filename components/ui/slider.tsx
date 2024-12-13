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
        slides: { perView: 2, spacing: 10 }, // For screens >= 640px
      },
    },
    slides: {
      perView: 1, 
      spacing: 5,
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
    <div className="px-[30px]">
      <div ref={sliderRef} className="keen-slider">
        {items.map((classItem) => (
          <div key={classItem.id} className="keen-slider__slide">
            <div className="flex flex-col items-center bg-blue-300 p-4 rounded-lg shadow-md">
              <figure className="w-full h-[250px] overflow-hidden rounded-lg">
                <Image
                  src={classItem.image}
                  alt={`${classItem.name} image`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full hover:scale-105 transition duration-300"
                />
              </figure>
              <h3 className="text-lg font-semibold mt-4 capitalize">
                {classItem.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <Fragment>
          <button 
          onClick={() => instanceRef.current?.prev()} 
          aria-label="Previous Slide"
          className=" absolute h-full w-[30px] bg-indigo-400 rounded-tl-md rounded-bl-md top-0 left-0 flex justify-center items-center text-2xl"
          >
          <FaChevronLeft className=" fill-blue-300"/>
          </button>

          <button 
          onClick={() => instanceRef.current?.next()} 
          aria-label="Next Slide"
          className=" absolute h-full w-[30px] bg-indigo-400 rounded-tr-md rounded-br-md top-0 right-0 flex justify-center items-center text-2xl"
          >
            <FaChevronRight className=" fill-blue-300"/>
          </button>
        </Fragment>
      )}
    </div>
  )
};

export default Slider;