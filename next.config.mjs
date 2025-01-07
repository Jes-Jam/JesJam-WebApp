/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
          },
        ],
      },
};

export default nextConfig;
