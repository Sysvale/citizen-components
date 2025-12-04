import { type Address as AddressType } from '@/types';
import ufs from '@/constants/ufs';

type City = {
	id: string;
	value: string;
};

type Uf = {
	id: string;
	ibgeCode: string | number;
	name: string;
	shortName: string;
};

export class Address {
	public street?: string;
	public number?: string;
	public complement?: string;
	public neighborhood?: string;
	private _city?: City;
	private _uf?: Uf;

	constructor(args: AddressType) {
		this.street = args.street;
		this.number = args.number;
		this.complement = args.complement;
		this.neighborhood = args.neighborhood;
		this.city = args.city;
		this.uf = args.uf;
	}

	set city(city: City | string | undefined) {
		if (!city) return;

		this._city = typeof city === 'string'
			? {
				id: city,
				value: city,
			}
			: city;
	}

	set uf(uf: Uf | string | undefined) {
		if (!uf) return;

		if (typeof uf !== 'string') {
			this._uf = uf;
			return;
		}

		const resolvedUf = ufs.find(ufItem => ufItem.id === uf);

		if (!resolvedUf) {
			return;
		}

		this._uf = {
			id: uf as string,
			ibgeCode: resolvedUf.ibgeCode,
			name: resolvedUf.name,
			shortName: resolvedUf.shortName,
		};
	}

	get city(): City | undefined {
		return this._city;
	}

	get uf(): Uf | undefined {
		return this._uf;
	}

	get fancyAddress() {
		if (!this.city || !this.uf) {
			return `${this.street},
				${this.number},
				${this.neighborhood}`;
		}

		return `${this.street},
			${this.number},
			${this.neighborhood},
			${this.city.value} - ${this.uf.shortName}`
	}

	get asFormData() {
		return {
			street: this.street,
			number: this.number,
			complement: this.complement,
			neighborhood: this.neighborhood,
			city: this.city,
			uf: this.uf,
		};
	}

	get asRequestPayload() {
		return {
			street: this.street,
			number: this.number,
			complement: this.complement,
			neighborhood: this.neighborhood,
			city: typeof this.city === 'object' ? this.city?.id : this.city,
			uf: typeof this.uf === 'object' ? this.uf?.id : this.uf,
		};
	}
}