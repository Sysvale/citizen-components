import { Citizen } from './Citizen';
import type { Citizen as CitizenType } from './Citizen';
import { genderFromType } from '@/constants/genders';
import { Address } from './Address';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { citizenFixture } from '../services/citizen/citizen.fixture';
import { raceByValue } from '@/constants/races';
// @ts-ignore
import { maskCpf, maskCns, maskPhone } from '@sysvale/foundry';
// @ts-ignore
import { DateTime } from 'luxon';

describe('Citizen model', () => {
	let citizen: CitizenType;

	beforeEach(() => {
		citizen = new Citizen(citizenFixture);
	});

	afterEach(() => {
		citizen = new Citizen({});
	});

	test('gender is resolved correctly with both types', () => {
		const gender = genderFromType(citizenFixture.gender as string);
		const newCitizen = new Citizen({
			...citizenFixture,
			gender,
		});

		expect(citizen.gender).toEqual(gender);
		expect(newCitizen.gender).toEqual(gender);
	});

	test('personalInfo is resolved correctly', () => {
		const fancyGender = genderFromType(citizenFixture.gender as string).name;
		const fancyRace = raceByValue(citizenFixture.race).name;

		const fieldsToHide = ['race'];

		expect(citizen.getPersonalInfo()).toEqual([
			{ label: 'CPF', value: maskCpf(citizenFixture.cpf), field: 'cpf' },
			{ label: 'CNS', value: maskCns(citizenFixture.cns), field: 'cns' },
			{ label: 'RG', value: 'Não informado', field: 'identification_document' },
			{ label: 'Data de nascimento', value: DateTime.fromISO(citizenFixture.birth_date).toFormat('dd/MM/yyyy'), field: 'birth_date' },
			{ label: 'Sexo', value: fancyGender, field: 'gender' },
			{ label: 'Raça/Cor', value: fancyRace, field: 'race' },
		]);

		expect(citizen.getPersonalInfo(fieldsToHide)).toEqual([
			{ label: 'CPF', value: maskCpf(citizenFixture.cpf), field: 'cpf' },
			{ label: 'CNS', value: maskCns(citizenFixture.cns), field: 'cns' },
			{ label: 'RG', value: 'Não informado', field: 'identification_document' },
			{ label: 'Data de nascimento', value: DateTime.fromISO(citizenFixture.birth_date).toFormat('dd/MM/yyyy'), field: 'birth_date' },
			{ label: 'Sexo', value: fancyGender, field: 'gender' },
		]);
	});

	test('contactInfo is resolved correctly', () => {
		expect(citizen.getContactInfo()).toEqual([
			{ label: 'Telefone', value: 'Não informado', field: 'phone' },
			{ label: 'Celular', value: maskPhone(citizenFixture.cellphone), field: 'cellphone' },
			{ label: 'E-mail', value: 'Não informado', field: 'email' },
			{ label: 'Endereço', value: citizen.fancyAddress, fill: true, field: 'address' },
		]);
	});

	test('isPregnant is resolved correctly', () => {
		expect.assertions(3);

		expect(citizen.isPregnant).toBeFalsy();

		citizen.pregnant = true;

		expect(citizen.isPregnant).toBeTruthy();

		citizen.gender = 'M';

		expect(citizen.isPregnant).toBeFalsy();
	});

	test('fancyAddress is created correctly', () => {
		const address = new Address(citizenFixture.address);

		expect(citizen.fancyAddress).toEqual(address?.fancyAddress);
	});
});
