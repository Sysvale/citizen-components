export interface Endpoints {
	index: string;
	create: string;
}

export interface CitizenComponentsConfig {
	apiBaseUrl: string;
	endpoints: Endpoints;
}

const defaultConfig: CitizenComponentsConfig = {
	apiBaseUrl: '',
	endpoints: {
		index: '/citizens',
		create: '/citizens',
	},
};

let globalConfig: CitizenComponentsConfig = { ...defaultConfig };

export function getConfig(): CitizenComponentsConfig {
	return globalConfig;
}

export function setConfig(config: CitizenComponentsConfig): void {
	globalConfig = {
		...defaultConfig,
		...config,
		endpoints: {
			...defaultConfig.endpoints,
			...config.endpoints,
		},
	};
}
