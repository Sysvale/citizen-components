import { defineRule, configure } from 'vee-validate';
import { email, min, required } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
// @ts-ignore
import { cpfValidator, cnsValidator } from '@sysvale/foundry';
import requiredWithout from './requiredWithout';

setLocale('pt-BR');

configure({
	generateMessage: localize('pt-BR', {
		messages: {
			required: 'Este campo é obrigatório',
			email: 'O e-mail é inválido',
			min: 'O campo deve ter no mínimo 0:{min} caracteres',
		}
	})
});

defineRule('required', required);
defineRule('min', min);
defineRule('email', email);
defineRule('required_without', (value: string, target: string[]) => {
	const res = requiredWithout(value, target);

	console.log(value, target);

	if (!res) {
		return 'Este campo é obrigatório';
	}

	return true;
});

defineRule('cpf', (value: string) => {
	const res = cpfValidator(value ?? '');

	if (!res) {
		return 'O CPF é inválido';
	}

	return true;
});

defineRule('cns', (value: string) => {
	if (!value || value === '') {
		return true;
	}

	const res = cnsValidator(value ?? '');

	if (!res) {
		return 'O CNS é inválido';
	}

	return true;
});
