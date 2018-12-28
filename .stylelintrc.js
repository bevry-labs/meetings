// 2018 July 25
// https://github.com/bevry/base
// https://stylelint.io/user-guide/rules/
module.exports = {
	extends: 'stylelint-config-standard',
	rules: {
		indentation: 'tab',
		'rule-empty-line-before': null,
		'custom-property-empty-line-before': null,
		'at-rule-empty-line-before': null,
		'declaration-empty-line-before': null,
		'max-empty-lines': 2,
		'selector-list-comma-newline-after': null,
		'no-duplicate-selectors': null,
		'no-descending-specificity': null,
		'block-closing-brace-empty-line-before': null,
		'block-closing-brace-newline-after': null,
		'block-closing-brace-newline-before': null,
		'block-closing-brace-space-before': null,
		'block-opening-brace-newline-after': null,
		'block-opening-brace-space-after': null,
		'block-opening-brace-space-before': null,
		'declaration-block-semicolon-newline-after': null,
		'declaration-block-semicolon-space-after': null,
		'declaration-block-semicolon-space-before': null,
		'declaration-block-trailing-semicolon': null
	},
	ignoreFiles: ['**/vendor/*.css', 'node_modules']
}
