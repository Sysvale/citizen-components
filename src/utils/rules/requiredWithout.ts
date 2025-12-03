import { required } from '@vee-validate/rules';

const requiredIf = (value: string, target: string[]) => {
	if (!target[0]) {
		return required(value);
	}

	return true;
};

export default requiredIf;
