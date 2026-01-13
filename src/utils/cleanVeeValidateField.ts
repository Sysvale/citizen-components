import type { FieldBindingObject } from 'vee-validate';

export const cleanVeeValidateField = (
	field: FieldBindingObject,
	fieldsToRemove: string[]
): FieldBindingObject => {
	return Object.keys(field).reduce((acc, key) => {
		if (!fieldsToRemove.includes(key)) {
			(acc as any)[key] = (field as any)[key];
		}
		return acc;
	}, {} as FieldBindingObject);
};
