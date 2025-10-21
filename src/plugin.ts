import type { App, Plugin } from 'vue';
import type { CitizenComponentsConfig } from './config';
import { setConfig } from './config';

export const CitizenComponentsPlugin: Plugin = {
	install(app: App, options: CitizenComponentsConfig = {}) {
		setConfig(options);

		// app.component('CitizenSelect', CitizenSelect);
	},
};

export default CitizenComponentsPlugin;
