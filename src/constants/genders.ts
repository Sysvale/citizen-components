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
