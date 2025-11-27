import type { CreateCitizenParams } from '@/services/citizen/citizen.types';
import type { Address, Gender, Race } from '@/types';
import { raceMapByValue } from '@/constants/races';
import { genderFromType } from '@/constants/genders';
import { DateTime } from 'luxon';
import {
	removeCpfMask,
	removeCnsMask,
	maskCpf,
	maskCns,
	maskPhone,
} from '@sysvale/foundry';

export class Citizen {
	public cpf: string | undefined;
	public cns: string | undefined;
	public name: string;
	private internalGender: Gender = {
		name: 'Masculino',
		value: 'M',
	};
	public birth_date: string;
	public identification_document: string;
	public pregnant: boolean;
	public address?: Address;
	public cellphone?: string;
	public phone: string;
	public email: string;
	public race?: Race;

	constructor(args: any) {
		this.cpf = args.cpf;
		this.cns = args.cns;
		this.name = args.name;
		this.gender = args.gender;
		this.birth_date = args.birth_date;
		this.identification_document = args.identification_document;
		this.pregnant = args.pregnant;
		this.address = args.address;
		this.phone = args.phone;
		this.cellphone = args.cellphone;
		this.email = args.email;

		if (args.race) {
			this.race = typeof args.race === 'string'
				? raceMapByValue[args.race]
				: args.race;
		}
	}

	set gender(gender: Gender | string) {
		if (typeof gender === 'string') {
			this.internalGender = genderFromType(gender);
			return
		}
		this.internalGender = gender;
	}

	get gender() {
		return this.internalGender;
	}

	get personalInfo() {
		return [
			{ label: 'CPF', value: maskCpf(this.cpf) ?? 'Não informado' },
			{ label: 'CNS', value: maskCns(this.cns) ?? 'Não informado' },
			{ label: 'RG', value: this.identification_document ?? 'Não informado' },
			{ label: 'Data de nascimento', value: DateTime.fromISO(this.birth_date).toFormat('dd/MM/yyyy') },
			{ label: 'Sexo', value: this.internalGender.name },
			{ label: 'Raça/Cor', value: this.race?.name ?? 'Não informado' },
		];	
	}

	get contactInfo() {
		return [
			{ label: 'Telefone', value: maskPhone(this.phone) ?? 'Não informado' },
			{ label: 'Celular', value: maskPhone(this.cellphone) ?? 'Não informado' },
			{ label: 'E-mail', value: this.email ?? 'Não informado' },
			{ label: 'Endereço', value: this.fancyAddress, fill: true },
		];
	}

	get isPregnant() {
		return this.internalGender.value === 'F' && this.pregnant;
	}

	get fancyAddress() {
		if (!this.address) {
			return 'Não informado';
		}

		return `${this.address.street},
			${this.address.number},
			${this.address.neighborhood},
			${this.address.city} - ${this.address.uf}`
	}

	asRequestPayload = (): CreateCitizenParams => {
		return {
			cpf: removeCpfMask(this.cpf),
			cns: removeCnsMask(this.cns),
			name: this.name,
			gender: this.internalGender?.value,
			birth_date: this.birth_date,
			identification_document: this.identification_document,
			pregnant: this.pregnant,
			...(this.address && { address: this.address }),
			phone: this.phone,
			email: this.email,
			...(this.race && { race: this.race.value }),
		} as CreateCitizenParams;
	};
}
