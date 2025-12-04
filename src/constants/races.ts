import type { Race } from '@/types';

export const white: Race = {
	name: 'Branca',
	value: 'white',
};

export const black: Race = {
	name: 'Preta',
	value: 'black',
};

export const mixed: Race = {
	name: 'Parda',
	value: 'mixed',
};

export const asian: Race = {
	name: 'Amarela',
	value: 'asian',
};

export const indigenous: Race = {
	name: 'Indígena',
	value: 'indigenous',
}
export const races: Race[] = [white, black, mixed, asian, indigenous];

export const raceByValue = (race: string) => {
	const resolvedRace = races.find(raceItem => raceItem.value === race);

	if (!resolvedRace) {
		return white;
	}

	return resolvedRace;
}
