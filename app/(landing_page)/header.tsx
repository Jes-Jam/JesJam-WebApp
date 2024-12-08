import Image from "next/image"
import Link from "next/link";

import {
    ClerkLoading,
    ClerkLoaded,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton
} from "@clerk/nextjs"
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="fixed top-0 w-full z-10 h-20 border-b-2 border-slate-200 px-4 bg-white">
            <div className="lg:max-w-screen-xl mx-auto flex items-center justify-between h-full">
                <div className="py-8 pl-4 flex items-center gap-x-3">
                    <Image src="/images/jesjam_logo.svg" alt="jesjam-logo" width={80} height={80} className="object-contain" />
                    <h1 className="text-2xl font-bold text-sky-500">JesJam</h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <div className="flex items-center gap-x-4">
                            <SignInButton
                                mode="modal"
                                {...({ afterSignInUrl: "/study", afterSignUpUrl: "/study" } as any)}
                            >
                                <Button size="lg" variant="ghost">Sign In</Button>
                            </SignInButton>
                            <Link href="/study">
                                <Button size="lg" variant="sidebar">
                                    Start Learning For Free
                                </Button>
                            </Link>
                        </div>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    );
}

export default Header;
