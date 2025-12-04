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
		const gender = genderFromType(citizenFixture.gender);
		const newCitizen = new Citizen({
			...citizenFixture,
			gender,
		});

		expect(citizen.gender).toEqual(gender);
		expect(newCitizen.gender).toEqual(gender);
	});

	test('personalInfo object is resolved correctly', () => {
		const fancyGender = genderFromType(citizenFixture.gender).name;
		const fancyRace = raceByValue(citizenFixture.race).name;

		expect(citizen.personalInfo).toEqual([
			{ label: 'CPF', value: maskCpf(citizenFixture.cpf) },
			{ label: 'CNS', value: maskCns(citizenFixture.cns) },
			{ label: 'RG', value: 'Não informado' },
			{ label: 'Data de nascimento', value: DateTime.fromISO(citizenFixture.birth_date).toFormat('dd/MM/yyyy') },
			{ label: 'Sexo', value: fancyGender },
			{ label: 'Raça/Cor', value: fancyRace },
		]);
	});

	test('contactInfo object is resolved correctly', () => {
		expect(citizen.contactInfo).toEqual([
			{ label: 'Telefone', value: 'Não informado' },
			{ label: 'Celular', value: maskPhone(citizenFixture.cellphone) },
			{ label: 'E-mail', value: 'Não informado' },
			{ label: 'Endereço', value: citizen.fancyAddress, fill: true },
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

		expect(citizen.fancyAddress).toEqual(address.fancyAddress);
	});
});
