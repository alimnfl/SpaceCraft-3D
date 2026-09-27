import type { NextConfig } from "next";
import { ENV } from "@/constants/Env";

const nextConfig: NextConfig = {
  output: ENV.NODE_ENV === "production" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
