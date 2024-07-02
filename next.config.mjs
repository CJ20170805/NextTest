/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
		serverActions: {
			// allowedForwardedHosts: ['localhost'],
			allowedOrigins: ['http://localhost','kbvg78dx-3000.usw2.devtunnels.ms']
		},
	}
};

export default nextConfig;
