import type { Gender } from '@/types';

const GENDERS: Gender[] = [
	{
		name: 'Feminino',
		value: 'F',
	},
	{
		name: 'Masculino',
		value: 'M',
	},
];

export const genders = () => {
	return GENDERS;
}

export const genderFromType = (type: string) => {
	return GENDERS.find(gender => gender.value === type);
}
