const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

function renderTemplate (url, title = 'Redirect') {
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

const redirects = require('../package.json').redirects
const www = path.join(__dirname, '..', 'www')

Object.keys(redirects).forEach(function (key) {
	const url = redirects[key]
	const dir = path.join(www, key)
	mkdirp(dir, function (err) {
		if (err) throw err
		fs.writeFile(path.join(dir, 'index.html'), renderTemplate(url), function (err) {
			if (err) throw err
		})
	})
})