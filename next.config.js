// next.config.js
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true, 
  swcMinify: true,
  runtime: 'edge', // Define the runtime here
};

module.exports = withContentlayer(nextConfig);
