import { type TableField } from '@/types';

export const createFields = (): TableField[] => [
	{
		key: 'name',
		label: 'Nome',
	},
	{
		key: 'birth_date',
		label: 'Data de nascimento',
	},
	{
		key: 'actions',
		label: '',
	},
];
