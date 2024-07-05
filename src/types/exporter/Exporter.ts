import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import getFileNameFromClass from '../../utils/getFileNameFromClass'
import { Manifest } from '../manifest/Manifest'
import { MinecraftType } from './MinecraftType'
import { PathType } from './PathType'

const localAppdata = process.env['LOCALAPPDATA']

export class Exporter {
	private _path: string
	private mc_type: MinecraftType = MinecraftType.Release
	private path_type: PathType = PathType.Development

	constructor(private manifest: Manifest) {
		this._path = manifest.name.match(/\w+/g)?.join('') || manifest.uuid
	}

	get path() {
		const path_type = this.path_type === PathType.Development ? 'development_' : ''
		return join(
			localAppdata,
			'Packages',
			this.mc_type,
			'LocalState',
			'games',
			'com.mojang',
			`${path_type}${this.manifest.type}`,
			this._path
		)
	}

	export(quiet: boolean = false) {
		mkdirSync(this.path, { recursive: true })
		const fn = getFileNameFromClass(this.manifest)
		writeFileSync(join(this.path, fn), JSON.stringify(this.manifest.compile(), null, 0))
	}
}
