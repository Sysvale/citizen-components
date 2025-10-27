import type { Gender } from '@/types';
import { removeCpfMask, removeCnsMask } from '@sysvale/foundry';

export class Citizen {
	private cpf: string = '';
	private cns: string = '';
	private name: string = '';
	private gender: Gender | null = null;
	private birth_date: string = '';

	constructor(args?: any) {
		this.cpf = args?.cpf ?? '';
		this.cns = args?.cns ?? '';
		this.name = args?.name ?? '';
		this.gender = args?.gender ?? null;
		this.birth_date = args?.birth_date ?? '';
	}

	asRequestPayload = () => {
		return {
			cpf: removeCpfMask(this.cpf),
			cns: removeCnsMask(this.cns),
			name: this.name,
			gender: this.gender!.value,
			birth_date: this.birth_date,
		};
	};
}
