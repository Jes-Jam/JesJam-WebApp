import Image from "next/image"
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
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
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
                        <SignInButton
                            mode="modal"
                            afterSignInUrl="/study"
                            afterSignUpUrl="/study"
                        >
                            <Button size="lg" variant="ghost">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    );
}

export default Header;