"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Facebook } from "lucide-react";

function ShareProgress() {
    const { user } = useUser();

    const handleFacebookShare = () => {
        // Log user data for debugging
        console.log('User data:', {
            points: user?.publicMetadata?.points,
            isLoaded: !!user,
        });

        const url = window.location.href;
        console.log('Current URL:', url);

        const points = user?.publicMetadata?.points || 0;
        const text = `I've earned ${points} points on Jesjam! Check out my progress!`;
        console.log('Share text:', text);

        try {
            // Try using the Facebook Feed Dialog
            const fbShareUrl = `https://www.facebook.com/dialog/feed?` +
                `app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}` +
                `&link=${encodeURIComponent(url)}` +
                `&quote=${encodeURIComponent(text)}` +
                `&description=${encodeURIComponent(text)}` +
                `&caption=Learning Progress` +
                `&redirect_uri=${encodeURIComponent(url)}`;

            console.log('Generated FB URL:', fbShareUrl);

            window.open(
                fbShareUrl,
                'facebook-share-dialog',
                'width=626,height=436'
            );
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    // Log when component mounts
    console.log('ShareProgress mounted, user:', user?.id);

    return (
        <div className="mt-4 p-4 bg-white rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-sky-500 mb-3">Share Your Progress</h2>
            <p className="text-sm text-gray-600 mb-4">
                Share your learning journey with friends and inspire others!
            </p>
            <Button
                onClick={handleFacebookShare}
                className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
                onMouseOver={() => console.log('Button hover')}
            >
                <Facebook className="w-4 h-4 mr-2" />
                Share on Facebook
            </Button>
        </div>
    );
}

export default ShareProgress;

