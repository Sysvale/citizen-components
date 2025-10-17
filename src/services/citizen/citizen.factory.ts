import { faker } from '@faker-js/faker';
import type { Citizen } from './citizen.types';

export const makeCitizen = (overrides?: Partial<Citizen>): Citizen => {
	return {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		gender: faker.helpers.arrayElement(['M', 'F']),
		cpf_responsible: null,
		mother_name: faker.person.fullName(),
		cpf: faker.number
			.int({ min: 10000000000, max: 99999999999 })
			.toString(),
		cns: faker.string.numeric(15),
		birth_date: faker.date.birthdate().toISOString().split('T')[0] || '',
		phone: faker.helpers.fromRegExp(/[0-9]{2} [0-9]{4}-[0-9]{4}/),
		cellphone: faker.helpers.fromRegExp(/[0-9]{2} [0-9]{4}-[0-9]{4}/),
		email: faker.internet.email(),
		address: {
			cep: faker.location.zipCode(),
			street: faker.location.street(),
			number: faker.string.numeric(3),
			complement: faker.location.secondaryAddress(),
			neighborhood: faker.location.street(),
			city: faker.location.city(),
			uf: faker.location.state({ abbreviated: true }),
		},
		race: faker.helpers.arrayElement([
			'white',
			'black',
			'brown',
			'indigenous',
			'yellow',
		]),
		co_cidadao: faker.number.int({ min: 1000, max: 9999 }),
		is_dead: faker.datatype.boolean(),
		pregnant: faker.datatype.boolean(),
		identification_document: faker.string.numeric(9).toUpperCase(),
		issuing_agency: faker.helpers.arrayElement(['SSP', 'DETRAN', 'IFP']),
		...overrides,
	};
};

export const makeCitizens = (
	citizenCount = 1,
	overrides?: Partial<Citizen>
): Citizen[] => {
	faker.seed(123);
	return Array.from({ length: citizenCount }, () => makeCitizen(overrides));
};
