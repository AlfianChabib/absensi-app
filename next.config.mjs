// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   scope: "/",
// });

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
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
  // allowedDevOrigins: [
  //   "http://192.168.1.28",
  //   "http://192.168.1.28",
  //   "http://localhost",
  //   "http://192.168.1.28",
  //   "http://192.168.1.28",
  // ],
  // allowedDevOrigins: ["192.168.1.28"],
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

export default nextConfig;

// export default withPWA(nextConfig);
