/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002').replace('localhost', '127.0.0.1');
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
