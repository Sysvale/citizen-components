import type { App, Plugin } from 'vue';
import type { CitizenComponentsConfig } from './config';
import Cuida from '@sysvale/cuida';
import { setConfig } from './config';

export const CitizenComponentsPlugin: Plugin = {
	install(app: App, options: CitizenComponentsConfig = {}) {
		setConfig(options);
		import('./utils/rules/citizenFormRules');

		const cdsUtils = Cuida.utils;
  		app.provide('useToast', cdsUtils.useToast);
	},
};

export default CitizenComponentsPlugin;
