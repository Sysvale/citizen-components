import { defineRule } from 'vee-validate';

defineRule('required', (value: string) => {
	if (!value || !value.length) {
		return 'Esse campo é obrigatório';
	}

	return true;
});

defineRule('minLength', (value: string, [limit]: [number]) => {
	if (!value || !value.length) {
		return true;
	}

	if (value.length < limit) {
		return `O campo deve ter no mínimo ${limit} caracteres`;
	}

	return true;
});
