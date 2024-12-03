"use client"
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
  SignInButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Biology from "../../public/images/static-images/biology.webp";
import History from "../../public/images/static-images/history.webp";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, Fragment } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const classes = [
    { id: 1, name: "biology", image: Biology},
    { id: 2, name: "chemistry", image: History},
    { id: 3, name: "biology", image: Biology},
    { id: 4, name: "chemistry", image: History},
  ];

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
    <div className="flex items-center flex-col w-full">
      <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-x-8 mt-[100px] my-[30px]">
        <div className="relative w-[240px] h-[240px] lg:w-[565px] lg:h-[400px] mb:8 lg:mb:0 ">
          <Image
            src="/images/landing_page_animation.svg"
            alt="jesjam-logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-y-9">
          <h1 className="text-3xl lg:text-4xl font-bold text-sky-600 text-left whitespace-nowrap">
            Learn with ease! &nbsp;😁
          </h1>
          <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  {...({
                    afterSignUpUrl: "/study",
                    afterSignInUrl: "/study",
                  } as any)}
                  mode="modal"
                >
                  <Button size="lg" variant="primary" className="w-full">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton
                  {...({
                    afterSignUpUrl: "/study",
                    afterSignInUrl: "/study",
                  } as any)}
                  mode="modal"
                >
                  <Button size="lg" variant="primaryOutline" className="w-full">
                    I already have an account
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="primary" className="w-full" asChild>
                  <Link href="/study">Continue Learning</Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
      
      {/* labels */}
      <div className="w-full px-[32px]">
        <h1 className="text-2xl font-bold mb-4">How is it work?</h1>
        <div className="w-full flex justify-between flex-col md:flex-row gap-3 md: gap:0">
          <Label className="bg-pink-400 ">Explore ton of classes</Label>
          <Label className="bg-violet-400 ">Start enroll</Label>
          <Label className="bg-yellow-400 ">Begin your journey</Label>
        </div>
      </div>
      
      {/* video */}
      <div className=" w-full px-[32px]">
        <video className=" w-full aspect-[16/9] lg:aspect-[8/3] bg-slate-200 my-10 rounded-md" src=""></video>
      </div>

      {/* classes */}
      <div className="w-full px-[32px] my-10">
        <h2 className="text-xl font-bold mb-6">Available Classes</h2>
        <div className="w-full relative">
          {/* Keen Slider */}
          <div ref={sliderRef} className="keen-slider">
            {classes.map((classItem) => (
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
        </div>
      </div>
    </div>
  );
}
