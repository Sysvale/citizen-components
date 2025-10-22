import type { Gender } from '@/types';
import { removeCpfMask, removeCnsMask } from '@sysvale/foundry';

export class Citizen {
	private cpf: string;
	private cns: string;
	private name: string;
	private gender: Gender;
	private birth_date: string;
	// private cpf_responsible: Nullable<string>;
	// private mother_name: string;
	// private phone: Nullable<string>;
	// private cellphone: Nullable<string>;
	// private email: Nullable<string>;
	// private address: {
	// 	cep: Nullable<string>;
	// 	street: Nullable<string>;
	// 	number: Nullable<string>;
	// 	complement: Nullable<string>;
	// 	neighborhood: Nullable<string>;
	// 	city: Nullable<string>;
	// 	uf: Nullable<string>;
	// };
	// private race: string;
	// private co_cidadao: number;
	// private is_dead: boolean;
	// private pregnant?: boolean | null;
	// private identification_document?: Nullable<string>;
	// private issuing_agency?: Nullable<string>;

	constructor(args?: any) {
		this.cpf = args?.cpf;
		this.cns = args?.cns;
		this.name = args?.name;
		this.gender = args?.gender;
		this.birth_date = args?.birth_date;
		// this.cpf_responsible = args?.cpf_responsible;
		// this.mother_name = args?.mother_name;
		// this.phone = args?.phone;
		// this.cellphone = args?.cellphone;
	}

	asRequestPayload = () => {
		return {
			cpf: removeCpfMask(this.cpf),
			cns: removeCnsMask(this.cns),
			name: this.name,
			gender: this.gender.value,
			birth_date: this.birth_date,
		};
	};
}
