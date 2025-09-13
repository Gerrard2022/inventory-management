/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inventory-backend-ad3hj7b2v-gerrard2022s-projects.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;