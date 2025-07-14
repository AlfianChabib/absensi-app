// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   aggressiveFrontEndNavCaching: true,
//   cacheOnFrontEndNav: true,
// });

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "*",
        search: "",
      },
    ],
  },
  allowedDevOrigins: ["http://192.168.1.28", "http://192.168.1.28"],
};

export default nextConfig;

// export default withPWA(nextConfig);
