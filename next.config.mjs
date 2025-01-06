/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: true,
    },
    images: {
        domains: [
            'upload.wikimedia.org',
        ]
    }
};

export default nextConfig;
