import { validate } from 'uuid'
import { assignIfNotUndefined } from '../../utils/assignIfNotUndefined'
import { Compileable } from '../Compilable'
import { Version } from '../version/Version'
import { ScriptModules } from './module/ScriptModules'

export class Dependency implements Compileable {
	private _uuid: string
	private module_name: ScriptModules
	private _version: Version | string
	public description?: string

	constructor(name_or_uuid: ScriptModules | string, version: Version | string) {
		if (typeof name_or_uuid === 'string' && !name_or_uuid.startsWith('@')) {
			this.uuid = name_or_uuid
		} else {
			this.module_name = <ScriptModules>name_or_uuid
		}

		this.version = version
	}

	set uuid(uuid: string) {
		if (!validate(uuid)) {
			console.warn('Invalid uuid, expected', uuid)
			return
		}
		this._uuid = uuid
	}

	get uuid() {
		return this._uuid
	}

	set version(version: Version | string) {
		if (this.module_name && typeof version !== 'string') {
			throw new Error(`Version cannot be assigned, string is allowed only, expected ${version}`)
		}
		this._version = version
	}

	get version() {
		return this._version
	}

	compile() {
		const p = {}
		assignIfNotUndefined(p, 'description', this.description)

		if (this.version) {
			if (this.module_name) {
				assignIfNotUndefined(p, 'module_name', this.module_name)
			} else {
				assignIfNotUndefined(p, 'uuid', this.uuid)
			}
			p['version'] = this.version
		}

		return p
	}
}
