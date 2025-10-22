import validate from '@/utils/cpfValidator';
import { defineRule } from 'vee-validate';

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
	const res = validate(value);

	if (!res) {
		return 'O CPF é inválido';
	}

	return true;
});

defineRule('cns', (value: string) => {
	const unmasked = value.replace(/[^\d]/g, '');

	if (!unmasked || !unmasked.length) {
		return true;
	}

	if (unmasked.length < 15) {
		return 'O CNS é inválido';
	}

	return true;
});
