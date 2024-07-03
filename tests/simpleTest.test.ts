import { Dependency, Manifest, ManifestType, ScriptModules } from '../src/index'

describe('simple Manifest test', () => {
	const manifest = new Manifest(ManifestType.Behavior, [1, 21, 0])
	manifest.addModule()
	const dependency1 = new Dependency('16a332e8-91e8-6030-aa9d-08ab032fe025', [1, 0, 0])
	const dependency2 = new Dependency(ScriptModules.Server, '1.13.0-beta')

	const manifest2 = new Manifest(ManifestType.Resources)
	manifest2.name = 'example resources pack'

	manifest2.addModule()

	dependency1.description = 'bstvvl'

	manifest.addDependency(dependency1)
	manifest.addDependency(dependency2)

	manifest.addDependency(Dependency.from(manifest2))

	const result = manifest.compile()

	console.log('Behavior Pack', result)
	console.log('Resource Pack', manifest2.compile())

	test('Manifest must have format_version, header, modules properties', () => {
		expect(result).toHaveProperty('format_version')
		expect(result).toHaveProperty('header')
		expect(result).toHaveProperty('modules')
	})

	test('Manifest must generate a matched uuid using name, description provided', () => {
		expect(result).toHaveProperty('header.uuid', 'd4dfa61c-8c6b-61cd-8756-8edafc32abd4')
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
