import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignUpButton, SignInButton } from "@clerk/nextjs"
import { Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
    return (
        <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-4">
            <div className="relative w-[240px] h-[240px] lg:w-[480px] lg:h-[480px] mb:8 lg:mb:0">
                <Image src="/images/jesjam_logo.svg" alt="jesjam-logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col gap-y-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-sky-600 max-w-[480px] text-center">
                    Learn with ease! &nbsp;😁
                </h1>
                <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
                    <ClerkLoading>
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <SignedOut>
                            <SignUpButton mode="modal" afterSignUpUrl="/study" afterSignInUrl="/study">
                                <Button size="lg" variant="primary" className="w-full">Get Started</Button>
                            </SignUpButton>
                            <SignInButton mode="modal" afterSignUpUrl="/study" afterSignInUrl="/study">
                                <Button size="lg" variant="primaryOutline" className="w-full">I already have an account</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Button size="lg" variant="primary" className="w-full" asChild>
                                <Link href="/learn">Continue Learning</Link>
                            </Button>
                        </SignedIn>
                    </ClerkLoaded>
                </div>
            </div>
        </div>
    );
}
