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

      {/* hero and auth */}
      <div className="min-h-[calc(100vh-50px)] w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-x-8">
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
      {/* End hero and auth */}

      {/* labels */}
      <div className="w-full py-12 gap-y-6">
        <div className="flex flex-col items-center justify-center mb-12">
          <InfiniteSlider />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl max-w-[500px] font-bold text-[#0084C7] md:text-3xl lg:text-4xl mb-4 text-center">
            Are you prepared for BACII? JesJam - is the app for you!
          </h1>
          <p className="text-md text-center text-gray-500">
            Flashcards, quizzes, potential BACII question, we have it all!
          </p>
        </div>

      </div>

      {/* screen */}
      <div className=" w-full px-[16px] md:px-[32px] my-10 gap-y-6">
        <div className="w-full aspect-[16/9] lg:aspect-[16/10] bg-slate-100 rounded-lg md:rounded-xl shadow-[0_3px_15px_3px_rgba(0,0,0,0.08)] border border-slate-200/50"></div>
      </div>

      {/* classes */}
      <div className="w-full px-[16px] md:px-[32px] my-10 md:my-12">
        {/* Available Classes */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-2xl max-w-[500px] font-bold text-[#0084C7] md:text-3xl lg:text-4xl mb-4 text-center">
            We got collections of classes for you! 📚
          </h1>
          <p className="text-md text-center text-gray-500">
            All questions you need to know for BACII are here!
          </p>
        </div>

        <div className="w-full relative">
          {/* Keen Slider */}
          <Slider items={transformedClasses} />
        </div>
      </div>

      {/* reviews */}
      <div className="w-full px-[16px] md:px-[32px] my-10 md:my-12">
        {/* Available Classes */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-2xl max-w-[500px] font-bold text-[#0084C7] md:text-3xl lg:text-4xl mb-4 text-center">
            What our students say?
          </h1>
          <span className="flex items-center justify-center">
            <Image src="/images/mascot.svg" alt="jesjam-logo" width={80} height={80} />
            <Image src="/images/mascot.svg" alt="jesjam-logo" width={80} height={80} />
            <Image src="/images/mascot.svg" alt="jesjam-logo" width={80} height={80} />
          </span>

        </div>
        <div className="w-full relative">
          <ReviewCards reviews={reviews} secondary={true} />
        </div>
      </div>

      {/* recruit */}
      <div className="w-screen flex flex-col justify-center items-center gap-3 bg-[#2980B9] py-12">
        <p className="font-bold text-lg text-white">Enter the next level of digital learning</p>
        <Button variant="sidebar" className="text-sky-700">Start Learning Now!</Button>
      </div>
    </div>
  );
}
