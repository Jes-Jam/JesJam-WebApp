"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const animation = { duration: 10000, easing: (t: number) => t };

export default function App() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: {
      perView: "auto", 
      spacing: 10, 
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider w-full overflow-hidden">
      <div className="keen-slider__slide number-slide1 bg-amber-600 text-white p-8 rounded-md">
        1
      </div>
      <div className="keen-slider__slide number-slide2 bg-amber-500 text-white p-8 rounded-md">
        2
      </div>
      <div className="keen-slider__slide number-slide3 bg-amber-400 text-white p-8 rounded-md">
        3
      </div>
      <div className="keen-slider__slide number-slide4 bg-amber-300 text-white p-8 rounded-md">
        4
      </div>
      <div className="keen-slider__slide number-slide5 bg-amber-200 text-black p-8 rounded-md">
        5
      </div>
      <div className="keen-slider__slide number-slide6 bg-amber-600 text-white p-8 rounded-md">
        6
      </div>
      <div className="keen-slider__slide number-slide1 bg-amber-600 text-white p-8 rounded-md">
        1
      </div>
      <div className="keen-slider__slide number-slide2 bg-amber-500 text-white p-8 rounded-md">
        2
      </div>
      <div className="keen-slider__slide number-slide3 bg-amber-400 text-white p-8 rounded-md">
        3
      </div>
      <div className="keen-slider__slide number-slide4 bg-amber-300 text-white p-8 rounded-md">
        4
      </div>
      <div className="keen-slider__slide number-slide5 bg-amber-200 text-black p-8 rounded-md">
        5
      </div>
      <div className="keen-slider__slide number-slide6 bg-amber-600 text-white p-8 rounded-md">
        6
      </div>
    </div>
  );
}
