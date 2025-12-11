import type { Address } from '../../types';

export type Nullable<T> = T | null;

export interface CitizenResponse {
	data: Citizen[];
	meta: {
		current_page: number;
		per_page: number;
		total: number;
		last_page: number;
		path?: string;
		from?: number;
		to?: number;
	};
}

export interface ReadCitizenResponse {
	data: Citizen[];
}

export interface CitizenServiceParams {
	page: number;
	fields?: string[];
	search_string?: string;
	per_page?: number;
}

export interface Citizen {
	id: string;
	cpf: string;
	cns: string;
	name: string;
	gender: string;
	cpf_responsible?: Nullable<string>;
	mother_name: string;
	birth_date: string;
	phone: Nullable<string>;
	cellphone: Nullable<string>;
	email: Nullable<string>;
	address: Address;
	race: string;
	co_cidadao: number;
	is_dead: boolean;
	pregnant?: boolean | null;
	identification_document?: Nullable<string>;
	issuing_agency?: Nullable<string>;
}

export interface CitizenParams {
	id?: string;
	name: string;
	birth_date: string;
	cpf: string;
	cns: string;
	gender: string;
	identification_document?: string;
	issuing_agency?: string;
	mother_name?: string;
	pregnant?: boolean;
	cpf_responsible?: string;
	address: Address;
	phone: string;
	cellphone?: string;
	email: string;
	race?: string;	
}

export interface CreateCitizenParams {
	name: string;
	birth_date: string;
	cpf: string;
	cns: string;
	gender: string;
	identification_document?: string;
	issuing_agency?: string;
	pregnant?: boolean;
	cpf_responsible?: string;
	address: Address;
	phone: string;
	cellphone?: string;
	email: string;
	race?: string;
}

export interface UpdateCitizenParams {
	id: string;
	name: string;
	birth_date: string;
	cpf: string;
	cns: string;
	gender: string;
	identification_document?: string;
	pregnant?: boolean;
	cpf_responsible?: string;
	address: Address;
	phone: string;
	email: string;
	race?: string;
}

export interface CreateCitizenResponse {
	data: {
		citizen: Citizen;
	};
}

export interface ReadCitizenParams {
	search_string: string;
}
