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
import InfiniteSlider from "../../components/ui/infiniteSlider";
import Slider from "../../components/ui/slider";
import ReviewCards from "@/components/ui/reviewCards";

import classes from "../../dev-data/classes";
import reviews from "../../dev-data/reviews";

export default function Home() {

  const transformedClasses = classes.map((cls) => ({
    id: cls.id.toString(), // convert id to string
    name: cls.name,
    image: cls.image.src, // extract the src property from the StaticImageData object
  }));

  return (
    <div className="flex items-center flex-col w-full text-gray-900">
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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lg:mb-8 text-center">How it work?</h1>
        <InfiniteSlider/>
      </div>
      
      {/* screen */}
      <div className=" w-full px-[32px]">
        <div className=" w-full aspect-[16/9] lg:aspect-[8/3] bg-slate-200 my-10 rounded-md shadow-[0_3px_20px_3px_rgba(0,0,0,0.2)]"></div>
      </div>

      {/* classes */}
      <div className="w-full px-[32px] my-10">
        <h2 className="text-xl font-bold mb-6">Available Classes</h2>
        <div className="w-full relative">
          {/* Keen Slider */}
          <Slider items={transformedClasses} />
        </div>
      </div>

      {/* reviews */}
      <div className="w-full px-[32px] my-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-10 text-center">What our students say?</h2>
        <div className="w-full relative">
          <ReviewCards reviews={reviews} secondary={true} />
        </div>
      </div>

      {/* recruit */}
      <div className="w-full my-10 flex flex-col justify-center items-center gap-3 bg-blue-600 py-12 md:rounded-md">
        <p className="font-bold text-lg text-white">Enter the next level of digital learning</p>
        <Button className="text-blue-500">Start Learning Now!</Button>
      </div>
    </div>
  );
}
