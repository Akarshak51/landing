/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@llama-node/core"]
  }
};

export default nextConfig;
