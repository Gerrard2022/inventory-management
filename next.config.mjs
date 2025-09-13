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
  env: {
    NEXT_PUBLIC_API_BASE_URL: "https://inventory-backend-ad3hj7b2v-gerrard2022s-projects.vercel.app",
  },
};

export default nextConfig;