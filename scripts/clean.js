const path = require('path')
const fs = require('then-fs')
const rimraf = require('rimraf-promise')

// Async Helper
async function init () {
	// Fetch paths
	const gitignorePath = path.join(__dirname, '..', '.gitignore')

	// Update gitignore with redirect directories
	const gitignoreContents = await fs.readFile(gitignorePath, 'utf8')
	const gitignoredFiles = gitignoreContents.split('# CUSTOM')[1].trim().split('\n')
	return Promise.all(
		gitignoredFiles.map(
			(file) => rimraf(
				path.resolve(__dirname, '..', file)
			)
		)
	)
}

// Run
init()
	.then(() => console.log('success'))
	.catch(function (err) {
		throw err
	})