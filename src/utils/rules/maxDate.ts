const isValidYmdDate = (date: string) => {
	const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

	if (!match) {
		return false;
	}

	const [, yearRaw, monthRaw, dayRaw] = match;
	const year = Number(yearRaw);
	const month = Number(monthRaw);
	const day = Number(dayRaw);
	const parsedDate = new Date(Date.UTC(year, month - 1, day));

	return (
		parsedDate.getUTCFullYear() === year
		&& parsedDate.getUTCMonth() === month - 1
		&& parsedDate.getUTCDate() === day
	);
};

const maxDate = (value: string, target: string[]) => {
	const normalizedValue = value?.trim?.() ?? '';

	if (!normalizedValue) {
		return true;
	}

	const max = target?.[0]?.trim?.() ?? '';

	if (!max || !isValidYmdDate(normalizedValue) || !isValidYmdDate(max)) {
		return false;
	}

	return normalizedValue <= max;
};

export default maxDate;
