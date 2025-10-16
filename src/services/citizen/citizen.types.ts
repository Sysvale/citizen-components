export type Nullable<T> = T | null;

export interface Citizen {
	id: string;
	cpf: string;
	cns: string;
	name: string;
	gender: string;
	cpf_responsible: Nullable<string>;
	mother_name: string;
	birth_date: string;
	phone: Nullable<string>;
	cellphone: Nullable<string>;
	email: Nullable<string>;
	address: {
		cep: Nullable<string>;
		street: Nullable<string>;
		number: Nullable<string>;
		complement: Nullable<string>;
		neighborhood: Nullable<string>;
		city: Nullable<string>;
		uf: Nullable<string>;
	};
	race: string;
	co_cidadao: number;
	is_dead: boolean;
	pregnant?: boolean | null;
	identification_document?: Nullable<string>;
	issuing_agency?: Nullable<string>;
}
