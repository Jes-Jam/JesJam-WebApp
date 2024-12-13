"use client";

import { useEffect, useRef } from "react";
import slogans from "../../dev-data/sloogans"; // Replace with your actual slogans data

export default function InfiniteSlider() {
  // Use a ref to access the slider element
  const infiniteSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Make sure the slider element is available
    const sliderElement = infiniteSliderRef.current;
    if (!sliderElement) return;

    let scrollAmount = 0;
    const scrollStep = .3; // Amount to scroll in each frame
    const scrollInterval = 1; // Interval in ms

    // Function to move the slider content
    const moveSlider = () => {
      scrollAmount += scrollStep;
      if (scrollAmount >= sliderElement.scrollWidth / 2) {
        scrollAmount = 0; // Reset scroll when we reach the end
      }
      sliderElement.scrollLeft = scrollAmount;
    };

    // Start the scrolling interval
    const intervalId = setInterval(moveSlider, scrollInterval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      ref={infiniteSliderRef}
      className="w-full overflow-x-hidden flex flex-nowrap"
    >
      {/* Duplicate the slogans to create an infinite effect */}
      {slogans.map((slogan) => (
        <div
          key={slogan.id}
          className="font-bold text-lg text-blue-500 p-8 rounded-md inline-block whitespace-nowrap"
        >
          {slogan.slogan}
        </div>
      ))}

    </div>
  );
}
