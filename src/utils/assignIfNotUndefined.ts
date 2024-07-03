export function assignIfNotUndefined(o: object, property_name: string, value: any) {
	if (value !== undefined) o[property_name] = value
}
