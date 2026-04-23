/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove the rewrite rule — dashboards call the backend directly via
  // NEXT_PUBLIC_API_URL (client-side), no proxy needed.
  // The rewrite was using process.env at build time which can be undefined.
};

module.exports = nextConfig;
