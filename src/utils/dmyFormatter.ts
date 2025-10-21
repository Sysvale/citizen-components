export function dmyFormatter(date: string) {
	const [year, month, day] = date.split('-').map(Number);

	if (!year || !month || !day) {
		return '--';
	}

	return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}
