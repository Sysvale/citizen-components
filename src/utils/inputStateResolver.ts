export default ({ validated, valid }: { validated: boolean; valid: boolean }) => {
	if (validated && !valid) {
		return 'invalid';
	}

	return 'default';
};
