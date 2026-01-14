import { getConfig, type Endpoints } from '@/config';

export default function isCustomEndpointSet(endpoint: keyof Endpoints) {
	const config = getConfig();
	return config.apiBaseUrl && config.endpoints && config.endpoints[endpoint];
}
