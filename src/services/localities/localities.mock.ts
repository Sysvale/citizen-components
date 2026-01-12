import { faker } from '@faker-js/faker';

export const makeNeighborhood = () => {
	return {
		name: faker.person.fullName(),
		city: faker.location.city(),
		uf: faker.location.state({ abbreviated: true }),
	};
};

export const makeNeighborhoods = (neighborhoodsCount = 1) => {
	faker.seed(123);
	return Array.from({ length: neighborhoodsCount }, () => makeNeighborhood());
};
