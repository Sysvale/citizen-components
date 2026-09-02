import { genderFromType } from '@/constants/genders';
import { raceByValue } from '@/constants/races';
import type { CitizenParams } from '@/services/citizen/citizen.types';
import type { Address, Gender, Race } from '@/types';
import { Address as AddressModel } from './Address';
// @ts-ignore
import {
	maskCns,
	maskCpf,
	maskPhone,
	removeCnsMask,
	removeCpfMask,
	removePhoneMask,
	// @ts-ignore
} from '@sysvale/foundry';
// @ts-ignore
import { DateTime } from 'luxon';
import { every } from 'lodash';

export class Citizen {
	public id?: string;
	public cpf: string | undefined;
	public cpf_responsible: string | undefined;
	public cns: string | undefined;
	public name: string;
	public birth_date?: string;
	public identification_document: string;
	public pregnant: boolean;
	public is_in_street_situation?: boolean;
	public mother_name?: string;
	public cellphone?: string;
	public phone: string;
	public email: string;
	public issuing_agency?: string;
	private _gender: Gender | null = null;
	private _race?: Race;
	private _address: Address | null = null;

	constructor(args: any) {
		this.id = args.id;
		this.cpf = args.cpf;
		this.cpf_responsible = args.cpf_responsible;
		this.cns = args.cns;
		this.name = args.name;
		this.gender = args.gender;
		this.race = args.race;
		this.birth_date = args.birth_date;
		this.identification_document = args.identification_document;
		this.mother_name = args.mother_name;
		this.pregnant = args.pregnant;
		this.is_in_street_situation = args.is_in_street_situation;
		this.phone = args.phone;
		this.cellphone = args.cellphone;
		this.email = args.email;
		this.issuing_agency = args.issuing_agency;

		if (!args.address) {
			this.address = {
				city: args.city,
				uf: args.uf,
				street: args.street,
				neighborhood: args.neighborhood,
				number: args.number,
				complement: args.complement,
				cep: args.cep,
			};
			return;
		}

		this.address = {
			city: args.address.city,
			uf: args.address.uf,
			street: args.address.street,
			neighborhood: args.address.neighborhood,
			number: args.address.number,
			complement: args.address.complement,
			cep: args.address.cep,
		};
	}

	set race(race: Race | string) {
		if (!race) return;

		if (typeof race === 'string') {
			this._race = raceByValue(race);
			return;
		}

		this._race = race;
	}

	set gender(gender: Gender | string) {
		if (!gender) return;

		if (typeof gender === 'string') {
			this._gender = genderFromType(gender);
			return;
		}

		this._gender = gender;
	}

	set address(address: any) {
		this._address = new AddressModel(address);
	}

	get address(): Address | null {
		return this._address;
	}

	get city(): Address['city'] {
		return this._address?.city;
	}

	get uf(): Address['uf'] {
		return this._address?.uf;
	}

	get street(): Address['street'] {
		return this._address?.street;
	}

	get neighborhood(): Address['neighborhood'] {
		return this._address?.neighborhood;
	}

	get number(): Address['number'] {
		return this._address?.number;
	}

	get complement(): Address['complement'] {
		return this._address?.complement;
	}

	get cep(): Address['cep'] {
		return this._address?.cep;
	}

	get race(): Race | undefined {
		return this._race;
	}

	get gender(): Gender | null {
		return this._gender;
	}

	getPersonalInfo(
		fieldsToHide?: string[],
		requiredFields: string[] = []
	): {
		label: string;
		value: string;
		fill?: boolean;
		field?: string;
		incomplete?: boolean;
		critical?: boolean;
	}[] {
		const fields = [
			{
				label: 'CPF',
				value: this.cpf ? maskCpf(this.cpf) : 'Não informado',
				field: 'cpf',
				incomplete: !this.cpf && requiredFields?.includes('cpf'),
				critical: !this.cpf && requiredFields?.includes('cpf'),
			},
			{
				label: 'CNS',
				value: this.cns ? maskCns(this.cns) : 'Não informado',
				field: 'cns',
				incomplete: !this.cns && requiredFields?.includes('cns'),
			},
			{
				label: 'RG',
				value: this.identification_document || 'Não informado',
				field: 'identification_document',
				incomplete:
					!this.identification_document &&
					requiredFields?.includes('identification_document'),
			},
			{
				label: 'Data de nascimento',
				value: this.birth_date
					? DateTime.fromISO(this.birth_date).toFormat('dd/MM/yyyy')
					: 'Não informada',
				field: 'birth_date',
				incomplete: !this.birth_date && requiredFields?.includes('birth_date'),
			},
			{
				label: 'Sexo',
				value: this._gender ? this._gender.name : 'Não informado',
				field: 'gender',
				incomplete: !this._gender && requiredFields?.includes('gender'),
			},
			{
				label: 'Raça/Cor',
				value: this.race?.name || 'Não informado',
				field: 'race',
				incomplete: !this.race && requiredFields?.includes('race'),
			},
			{
				label: 'Nome da mãe',
				value: this.mother_name || 'Não informado',
				fill: true,
				field: 'mother_name',
				incomplete: !this.mother_name && requiredFields?.includes('mother_name'),
			},
		];

		return fields.filter(({ field }) => !fieldsToHide?.includes(field));
	}

	getContactInfo(
		fieldsToHide?: string[],
		requiredFields: string[] = []
	): { label: string; value: Nullable<string>; fill?: boolean; field?: string }[] {
		const fields = [
			{
				label: 'Telefone',
				value: this.phone ? maskPhone(this.phone) : 'Não informado',
				field: 'phone',
				incomplete: !this.phone && requiredFields?.includes('phone'),
			},
			{
				label: 'Celular',
				value: this.cellphone ? maskPhone(this.cellphone) : 'Não informado',
				field: 'cellphone',
				incomplete: !this.cellphone && requiredFields?.includes('cellphone'),
			},
			{
				label: 'E-mail',
				value: this.email || 'Não informado',
				field: 'email',
				incomplete: !this.email && requiredFields?.includes('email'),
			},
			{
				label: 'Endereço',
				value: this.fancyAddress,
				fill: true,
				field: 'address',
				incomplete:
					this.address?.isIncomplete && requiredFields?.includes('address'),
			},
		];

		return fields.filter(({ field }) => !fieldsToHide?.includes(field));
	}

	get isPregnant() {
		if (!this._gender) {
			return false;
		}

		return this._gender.value === 'F' && this.pregnant;
	}

	get fancyAddress() {
		if (!this.address || every(this.address, value => !value)) {
			return 'Não informado';
		}

		return this.address?.fancyAddress;
	}

	asFormData = (): any => {
		return {
			cpf: this.cpf,
			cpf_responsible: this.cpf_responsible,
			cns: this.cns,
			name: this.name,
			gender: this._gender,
			birth_date: this.birth_date,
			identification_document: this.identification_document,
			mother_name: this.mother_name,
			pregnant: this.pregnant,
			is_in_street_situation: this.is_in_street_situation,
			phone: this.phone,
			cellphone: this.cellphone,
			email: this.email,
			issuing_agency: this.issuing_agency,
			race: this.race,
			...this.address?.asFormData,
		};
	};

	asRequestPayload = (): CitizenParams => {
		return {
			id: this.id,
			cpf: removeCpfMask(this.cpf),
			cpf_responsible: removeCpfMask(this.cpf_responsible),
			cns: removeCnsMask(this.cns),
			name: this.name,
			gender: this._gender?.value,
			birth_date: this.birth_date,
			identification_document: this.identification_document,
			mother_name: this.mother_name,
			pregnant: this.pregnant,
			is_in_street_situation: this.is_in_street_situation,
			address: this.address?.asRequestPayload || {},
			phone: removePhoneMask(this.phone),
			email: this.email,
			cellphone: removePhoneMask(this.cellphone),
			issuing_agency: this.issuing_agency,
			...(this.race && { race: this.race.value }),
		} as CitizenParams;
	};
}
