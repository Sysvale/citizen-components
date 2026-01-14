export default function clearValidationRefs(refs: Array<any | null>) {
	refs.forEach(ref => {
		ref.value?.[0].reset({
			value: undefined,
			touched: false,
			errors: [],
		});
	});
}
