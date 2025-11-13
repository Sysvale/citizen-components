import { defineRule } from 'vee-validate';
import { cpfValidator, cnsValidator } from '@sysvale/foundry';

defineRule('required', (value: string | object) => {
	if (!value) {
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

defineRule('cpf', (value: string) => {
	const res = cpfValidator(value);

	if (!res) {
		return 'O CPF é inválido';
	}

	return true;
});

defineRule('cns', (value: string) => {
	const res = cnsValidator(value);

	if (!res) {
		return 'O CNS é inválido';
	}

	return true;
});
