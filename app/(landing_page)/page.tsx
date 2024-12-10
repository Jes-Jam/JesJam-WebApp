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
import Label from "@/components/ui/label";
import Slider from "../../components/ui/slider";

import classes from "../../dev-data/classes";

export default function Home() {

  const transformedClasses = classes.map((cls) => ({
    id: cls.id.toString(), // convert id to string
    name: cls.name,
    image: cls.image.src, // extract the src property from the StaticImageData object
  }));

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
          <Slider items={transformedClasses} />
        </div>
      </div>

      {/* reviews */}
      <div className="w-full px-[32px] my-10">
        <h2 className="text-xl font-bold mb-6">What our students say?</h2>
        <div className="w-full relative">
          
        </div>
      </div>
    </div>
  );
}
