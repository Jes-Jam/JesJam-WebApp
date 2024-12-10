"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, Fragment } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    slides: {
      perView: 2,
      spacing: 15,
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
    <Fragment>
      <div ref={sliderRef} className="keen-slider">
        {items.map((classItem) => (
          <div key={classItem.id} className="keen-slider__slide">
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md h-[px]">
              <Image
                src={classItem.image}
                alt={`${classItem.name} image`}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-[250px] "
              />
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
          className=" absolute h-full w-[30px] bg-gray-300 opacity-50 rounded-tl-md rounded-bl-md top-0 left-0"
          >
          <ArrowLeft />
          </button>

          <button 
          onClick={() => instanceRef.current?.next()} 
          aria-label="Next Slide"
          className=" absolute h-full w-[30px] bg-gray-300 opacity-40 rounded-tr-md rounded-br-md top-0 right-0"
          >
            <ArrowRight />
          </button>
        </Fragment>
      )}
    </Fragment>
  )
};


export default Slider;