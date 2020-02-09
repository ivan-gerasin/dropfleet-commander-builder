module.exports = {
	roots: [
		'<rootDir>',
	],
	modulePaths: [
		'<rootDir>',
		'<rootDir>/src',
		'<rootDir>/test'
	],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}