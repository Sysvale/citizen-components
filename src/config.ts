export interface CitizenComponentsConfig {
	apiBaseUrl: string;
	endpoints: {
		index: string;
	};
}

const defaultConfig: CitizenComponentsConfig = {
	apiBaseUrl: '',
	endpoints: {
		index: '/citizens',
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
