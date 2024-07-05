import { Dependency, Manifest, ManifestType, ScriptModules } from '../src/index'

describe('simple Manifest test', () => {
	const manifest = new Manifest(ManifestType.Behavior, [1, 21, 0])
	manifest.name = 'example behavior pack'

	const manifest2 = new Manifest(ManifestType.Resources, [1, 21, 0])
	manifest2.name = 'example resources pack'

	manifest.addModule()
	manifest2.addModule()

	manifest.addDependency(new Dependency('16a332e8-91e8-6030-aa9d-08ab032fe025', [1, 0, 0]))
	manifest.addDependency(new Dependency(ScriptModules.Server, '1.13.0-beta'))
	manifest.addDependency(manifest2)

	manifest.metadata.authors = ['NguyenDuck']
	manifest.metadata.addGeneratedWith('unknown_api', ['bstvvl'])
	manifest.metadata.addGeneratedWith('unknown_api2', ['bstvvl'])

	// new Exporter(manifest).export()
	// new Exporter(manifest2).export()

	const result = manifest.compile()

	console.log(manifest.compile())
	console.log(manifest2.compile())

	test('Manifest must have format_version, header, modules properties', () => {
		expect(result).toHaveProperty('format_version')
		expect(result).toHaveProperty('header')
		expect(result).toHaveProperty('modules')
	})

	test('Manifest must generate a uuid using name, description provided', () => {
		expect(result).toHaveProperty('header.uuid')
	})

	test('Manifest modules value need have minimum one module', () => {
		expect(result).toHaveProperty('modules.0')
	})

	test('Manifest dependencies can add other modules', () => {
		expect(result).toHaveProperty('dependencies.0.uuid')
		expect(result).toHaveProperty('dependencies.0.version')

		expect(result).toHaveProperty('dependencies.1.module_name')
		expect(result).toHaveProperty('dependencies.1.version')

		expect(result).toHaveProperty('dependencies.2.uuid', manifest2.uuid)
		expect(result).toHaveProperty('dependencies.2.version', manifest2.version)
	})
})
