import type { Citizen } from './services/citizen/citizen.types';

export type { Citizen, Nullable } from './services/citizen/citizen.types';
export type CitizenSelectModelType = Citizen | Partial<Citizen> | string | null;

export interface TableField {
	key: keyof Citizen | 'actions';
	label: string;
}

export interface CustomTableField extends TableField {
	visible: boolean;
}

export interface Gender {
	name: 'Masculino' | 'Feminino';
	value: 'M' | 'F';
}

export interface Race {
	name: 'Branca' | 'Preta' | 'Parda' | 'Amarela' | 'Indígena';
	value: 'white' | 'black' | 'mixed' | 'asian' | 'indigenous';
}

export interface Address {
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city?: string;
	uf?: string;
}
