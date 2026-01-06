/// <reference types="vite/client" />
import type { Citizen } from './src/services/citizen/citizen.types';

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare global {
	// eslint-disable-next-line no-unused-vars
	type Nullable<T> = T | null;

	// eslint-disable-next-line no-unused-vars
	type CitizenSelectModelType = Citizen | Partial<Citizen> | string | null;

	Citizen;
}

export {};
