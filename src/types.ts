import type { Citizen } from './services/citizen/citizen.types';

export type { Citizen, Nullable } from './services/citizen/citizen.types';
export type CitizenSelectModelType = Citizen | Partial<Citizen> | string | null;

export interface TableField {
	key: keyof Citizen | 'actions';
	label: string;
}

export interface CitizenFormField {
	name: keyof Citizen | keyof Address;
	label: string;
	rules: string;
	colSpan: number;
	component: string | object;
	required?: boolean;
	mask?: string;
	placeholder?: string;
	options?: any[];
	maxDate?: string;
	optionsField?: string;
}

export interface CustomTableField extends TableField {
	visible: boolean;
}

export interface Gender {
	name: 'Masculino' | 'Feminino';
	value: 'M' | 'F';
}

export type Race = {
	name: 'Branca';
	value: 'white';
}
| {
	name: 'Preta';
	value: 'black';
}
| {
	name: 'Parda';
	value: 'mixed';
}
| {
	name: 'Amarela';
	value: 'asian';
}
| {
	name: 'Indígena';
	value: 'indigenous';
};

export interface Address {
	street?: string;
	number?: string;
	complement?: string;
	neighborhood?: string;
	city?: string | {
		id: string;
		value: string;
	};
	uf?: string | {
		ibgeCode: string;
		name: string;
		shortName: string;
		id: string;
	};
	asFormData?: any;
	asRequestPayload?: any;
	fancyAddress?: string;
}
