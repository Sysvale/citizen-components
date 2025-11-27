import type { Gender } from '@/types';

const male: Gender = {
	name: 'Masculino',
	value: 'M',
};

const female: Gender = {
	name: 'Feminino',
	value: 'F',
};

const GENDERS: Gender[] = [female, male];

export const genders = () => {
	return GENDERS;
}

export const genderFromType = (type: string) => {
	const resolvedGender = GENDERS.find(gender => gender.value === type);

	if (!resolvedGender) {
		return male;
	}

	return resolvedGender;
}
