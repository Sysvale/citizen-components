import ufs from '@/constants/ufs';

type City = {
	id: string;
	value: string;
};

type Neighborhood = {
	id: string;
	value: string;
};

type Street = {
	id: string;
	value: string;
};

type Uf = {
	id: string;
	ibgeCode: string | number;
	name: string;
	shortName: string;
};

function resolveFancyField(field: string | undefined): string {
	if (!field) return 'Não informado';

	return field;
}

export class Address {
	public number?: string;
	public complement?: string;
	private _city?: City;
	private _uf?: Uf;
	private _neighborhood?: Neighborhood;
	private _street?: Street;

	constructor(args: any) {
		this.number = args.number;
		this.complement = args.complement;
		this.city = args.city;
		this.uf = args.uf;
		this.neighborhood = args.neighborhood;
		this.street = args.street;
	}

	set city(city: City | string | undefined) {
		if (!city) return;

		this._city =
			typeof city === 'string'
				? {
					id: city,
					value: city,
				}
				: city;
	}

	set neighborhood(neighborhood: Neighborhood | string | undefined) {
		if (!neighborhood) return;

		this._neighborhood =
			typeof neighborhood === 'string'
				? {
					id: neighborhood,
					value: neighborhood,
				}
				: neighborhood;
	}

	set street(street: Street | string | undefined) {
		if (!street) return;

		this._street =
			typeof street === 'string'
				? {
					id: street,
					value: street,
				}
				: street;
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

	get neighborhood(): Neighborhood | undefined {
		return this._neighborhood;
	}

	get street(): Street | undefined {
		return this._street;
	}

	get fancyAddress(): string {
		if (!this.city || !this.uf) {
			return `${resolveFancyField(this.street?.value)},
				${resolveFancyField(this.number)},
				${resolveFancyField(this.neighborhood?.value)}`;
		}

		return `${resolveFancyField(this.street?.value)},
			${resolveFancyField(this.number)},
			${resolveFancyField(this.neighborhood?.value)},
			${resolveFancyField(this.city?.value)} - ${resolveFancyField(this.uf?.shortName)}`;
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
			street: typeof this.street === 'object' ? this.street.value : this.street,
			number: this.number,
			complement: this.complement,
			neighborhood:
				typeof this.neighborhood === 'object'
					? this.neighborhood?.value
					: this.neighborhood,
			city: typeof this.city === 'object' ? this.city?.value : this.city,
			uf: typeof this.uf === 'object' ? this.uf?.id : this.uf,
		};
	}
}
