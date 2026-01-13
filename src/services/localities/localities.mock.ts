import { faker } from '@faker-js/faker';

export const makeNeighborhood = () => {
	return {
		name: faker.location.county(),
		city: faker.location.city(),
		uf: faker.location.state({ abbreviated: true }),
	};
};

export const makeNeighborhoods = (neighborhoodsCount = 1) => {
	return Array.from({ length: neighborhoodsCount }, () => makeNeighborhood());
};

export const makeStreet = () => {
	return {
		name: faker.location.street(),
		city: faker.location.city(),
		uf: faker.location.state({ abbreviated: true }),
	};
};

export const makeStreets = (streetsCount = 1) => {
	return Array.from({ length: streetsCount }, () => makeStreet());
};
