import { createHash } from 'crypto'

export default function createUUIDFromString(s: string) {
	const h = createHash('sha512')
		.update(s)
		.digest('hex')
		.match(/(?:[0-9a-f]{8}[0-9a-f]{4}[1-8][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12})/)[0]
	return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join('-')
}
