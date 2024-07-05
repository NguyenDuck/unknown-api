import { assignIfNotUndefined } from '../../../utils/assignIfNotUndefined'
import { Compileable } from '../../Compilable'

export class Metadata implements Compileable {
	public authors?: string[]
	public license?: string
	public url?: string
	private generated_with: [string, (string | number)[]][] = []

	addGeneratedWith(k: string, v: (string | number)[]) {
		this.generated_with.push([k, v])
	}

	compile() {
		const p = {}

		assignIfNotUndefined(p, 'authors', this.authors)
		assignIfNotUndefined(p, 'license', this.license)
		assignIfNotUndefined(p, 'url', this.url)
		if (this.generated_with.length) {
			const p2 = {}
			this.generated_with.forEach(([v, a]) => (p2[v] = a))
			p['generated_with'] = p2
		}

		return p
	}
}
