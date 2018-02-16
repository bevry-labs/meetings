const path = require('path')
const fs = require('then-fs')
const mkdirp = require('mkdirp-promise')

// Redirect Template
function renderRedirectTemplate (url, title = 'Redirect') {
	return `<!DOCTYPE html>
<html>

<head>
	<title>${title}</title>
	<meta http-equiv="REFRESH" content="0; url=${url}">
	<link rel="canonical" href="${url}" />
</head>

<body>
	<script>document.location.href = "${url}"</script>
	<p>
		This page has moved. You will be automatically redirected to its new location. If you aren't forwarded to the new page,
		<a href="${url}">click here</a>.
	</p>
	<!-- this is an automatically generated file, do not edit it manually -->
</body>

</html>`
}

// Async Helper
async function init () {
	// Fetch paths
	const packagePath = path.join(__dirname, '..', 'package.json')
	const wwwPath = path.join(__dirname, '..', 'www')
	const gitignorePath = path.join(__dirname, '..', '.gitignore')

	// Fetch redirect data
	const redirects = require(packagePath).redirects
	const keys = Object.keys(redirects).sort()

	// Update gitignore with redirect directories
	const gitignoreContentsOriginal = await fs.readFile(gitignorePath, 'utf8')
	const gitignoreContentsUpdated =
		gitignoreContentsOriginal.split('# CUSTOM')[0]
		+ '# CUSTOM\n\n'
		+ keys.map((key) => `www/${key}/`).join('\n')
		+ '\n'
	await fs.writeFile(gitignorePath, gitignoreContentsUpdated)

	// Create the redirect files
	return Promise.all(
		keys.map(function (key) {
			const url = redirects[key]
			const dir = path.join(wwwPath, key)
			const file = path.join(dir, 'index.html')
			const contents = renderRedirectTemplate(url)
			return mkdirp(dir).then(() => fs.writeFile(file, contents))
		})
	)
}

// Run
init()
	.then(() => console.log('success'))
	.catch(function (err) {
		throw err
	})