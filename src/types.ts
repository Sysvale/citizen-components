export type { Citizen, Nullable } from './services/citizen/citizen.types';

import type { Citizen } from './services/citizen/citizen.types';
export type CitizenSelectModelType = Citizen | Partial<Citizen> | string | null;
