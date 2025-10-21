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
