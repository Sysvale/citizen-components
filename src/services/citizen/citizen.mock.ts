import { faker } from '@faker-js/faker';
import type { Citizen } from './citizen.types';
import { Citizen as CitizenModel } from '@/models/Citizen';
import ufs from '@/constants/ufs';

export const makeCitizen = (overrides?: Partial<Citizen>): CitizenModel => {
	return new CitizenModel({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		gender: faker.helpers.arrayElement(['M', 'F']),
		mother_name: faker.person.fullName(),
		cpf: faker.helpers.arrayElement(['04320568664', '47388253807', '11930974442', '95151567500']),
		cns: faker.helpers.arrayElement(['947401207820008', '150383531400002', '192134169240003', '146350365620000']),
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
			uf: faker.helpers.arrayElement(ufs),
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
		is_in_street_situation: faker.datatype.boolean(),
		identification_document: faker.string.numeric(9).toUpperCase(),
		issuing_agency: faker.helpers.arrayElement(['SSP', 'DETRAN', 'IFP']),
		...overrides,
	});
};

export const makeCitizens = (citizenCount = 1, overrides?: Partial<Citizen>): CitizenModel[] => {
	faker.seed(123);
	return Array.from({ length: citizenCount }, () => makeCitizen(overrides));
};
