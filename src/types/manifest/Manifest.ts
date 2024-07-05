import { validate } from 'uuid'
import { assignIfNotUndefined } from '../../utils/assignIfNotUndefined'
import createUUIDFromString from '../../utils/createUUIDFromString'
import { Compileable } from '../Compilable'
import { ManifestFormatVersion } from '../version/ManifestFormatVersion'
import { MinEngineVersion } from '../version/MinEngineVersion'
import { Version } from '../version/Version'
import { Dependency } from './Dependency'
import { ManifestType } from './ManifestType'
import { Metadata } from './metadata/Metadata'
import { Module, acceptedManifestTypes } from './module/Module'

export class Manifest implements Compileable {
	public format_version: ManifestFormatVersion = 2
	public name: string = ''
	public description?: string
	public version: Version = [1, 0, 0]
	private _uuid: string
	public base_game_version: Version
	public lock_template_options: boolean

	private modules: Module[] = []
	private dependencies: Dependency[] = []
	public metadata: Metadata = new Metadata()

	constructor(public readonly type: ManifestType, public min_engine_version: MinEngineVersion = [1, 2, 8]) {}

	set uuid(uuid: string) {
		if (!validate(uuid)) {
			console.warn('Invalid uuid, expected', uuid)
			return
		}
		this._uuid = uuid
	}

	get uuid() {
		return this._uuid ?? createUUIDFromString(`type:${this.type}name:${this.name}description:${this.description}`)
	}

	/**
	 * Add module into manifest
	 * @param module leave empty to create an self-created module (without uuid manually created)
	 */
	addModule(module?: Module) {
		if (!module) {
			const m = new Module(acceptedManifestTypes[this.type][0])
			m.description = 'Auto Generated Module For ' + this.uuid
			this.modules.push(m)
		} else if (module.isAcceptedManifestType(this.type)) {
			this.modules.push(module)
		} else {
			console.warn('The manifest type is not accepted module type of', module.type)
		}
	}

	addDependency(dependency: Dependency | Manifest) {
		if (dependency instanceof Manifest) {
			dependency = new Dependency(dependency.uuid, dependency.version)
		}
		this.dependencies.push(dependency)
	}

	compile(): object {
		const result = { format_version: this.format_version }

		const mtdt = this.metadata.compile()
		if (Object.keys(mtdt).length) result['metadata'] = mtdt

		const header = { name: this.name, version: this.version }

		assignIfNotUndefined(header, 'description', this.description)
		assignIfNotUndefined(header, 'uuid', this.uuid)
		assignIfNotUndefined(header, 'min_engine_version', this.min_engine_version)

		assignIfNotUndefined(header, 'base_game_version', this.base_game_version)
		assignIfNotUndefined(header, 'lock_template_options', this.lock_template_options)

		result['header'] = header
		result['modules'] = this.modules.map(v => v.compile())

		if (this.dependencies.length) result['dependencies'] = this.dependencies.map(v => v.compile())
		return result
	}
}
