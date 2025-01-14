import React from 'react'
import Image from 'next/image'

type PodiumProps = {
    index: number
}

function Podium({ index }: PodiumProps) {
    switch (index) {
        case 0:
            return (
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/40 border-2 border-yellow-500/40 rounded-full">
                    <Image
                        src="/icons/crown.svg"
                        alt="First place"
                        width={20}
                        height={20}
                    />
                </div>
            );
        case 1:
            return (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-400/30 border-2 border-gray-400/40 rounded-full">
                    <Image
                        src="/icons/crown.svg"
                        alt="First place"
                        width={20}
                        height={20}
                    />
                </div>
            );
        case 2:
            return (
                <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 border-2 border-red-500/40 rounded-full">
                    <Image
                        src="/icons/crown.svg"
                        alt="First place"
                        width={20}
                        height={20}
                    />
                </div>
            );
    }
}

export default Podium

