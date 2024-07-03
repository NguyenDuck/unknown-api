import { validate } from 'uuid'
import { assignIfNotUndefined } from '../../../utils/assignIfNotUndefined'
import createUUIDFromString from '../../../utils/createUUIDFromString'
import { Compileable } from '../../Compilable'
import { Version } from '../../version/Version'
import { ManifestType } from '../ManifestType'
import { ModuleType } from './ModuleType'

export const acceptedManifestTypes = {
	[ManifestType.Behavior]: [ModuleType.Data, ModuleType.Script],
	[ManifestType.Resources]: [ModuleType.Resources],
	[ManifestType.SkinPack]: [ModuleType.SkinPack],
	[ManifestType.WorldTemplate]: [ModuleType.WorldTemplate],
}

export class Module implements Compileable {
	private _uuid: string
	private _version: Version | string = [1, 0, 0]
	public description?: string

	constructor(public type: ModuleType) {}

	set uuid(uuid: string) {
		if (!validate(uuid)) {
			console.warn('Invalid uuid, expected', uuid)
			return
		}
		this._uuid = uuid
	}

	get uuid() {
		return this._uuid ?? createUUIDFromString(`type${this.type}description${this.description}`)
	}

	/**
	 * Version of module
	 *
	 * *Given string if module type is script*
	 */
	set version(version: Version | string) {
		if (typeof version === 'string' && this.type === ModuleType.Script) {
			this._version = version
		} else if (Array.isArray(version) && version.length === 3 && this.type !== ModuleType.Script) {
			this._version = version
		} else {
			console.warn('Datatype of version is not accepted in this module type, expected', typeof version)
		}
	}

	get version() {
		return this._version
	}

	isAcceptedManifestType(type: ManifestType) {
		return acceptedManifestTypes[type].includes(this.type)
	}

	compile() {
		const p = { type: this.type, version: this._version }

		if (this.type !== ModuleType.Script) p['uuid'] = this.uuid

		assignIfNotUndefined(p, 'description', this.description)

		return p
	}
}
