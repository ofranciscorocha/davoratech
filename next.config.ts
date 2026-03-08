import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  /*
  async rewrites() {
    return [
      {
        source: '/zap/:path*',
        destination: 'http://127.0.0.1:3005/zap/:path*',
      },
      {
        source: '/select/:path*',
        destination: 'https://rochaselect-production.up.railway.app/:path*',
      },
      {
        source: '/recicladora/:path*',
        destination: 'http://127.0.0.1:3010/recicladora/:path*',
      },
      {
        source: '/atelie/:path*',
        destination: 'https://laura-verissimo-production.up.railway.app/:path*',
      },
      {
        source: '/marketing',
        destination: 'http://127.0.0.1:5173/marketing/',
      },
      {
        source: '/marketing/:path*',
        destination: 'http://127.0.0.1:5173/marketing/:path*',
      },
      {
        source: '/patiorochaleiloes/:path*',
        destination: 'https://leilao-patio-rocha-production.up.railway.app/:path*',
      },
      {
        source: '/licitacoes/:path*',
        destination: 'https://licita-sistem-production.up.railway.app/:path*',
      },
      {
        source: '/crm/:path*',
        destination: 'https://rochacrm-production.up.railway.app/:path*',
      },
    ];
  },
  */
};

export default nextConfig;
