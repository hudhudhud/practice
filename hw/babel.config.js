module.exports = {
    presets: [
			[
			 '@vue/app', 
				// {
				//   polyfills: [
				//     'es6.promise',
				//     'es6.symbol',
				//   ]
				// },
				{"useBuiltIns": "entry"},
			]
	],
	"plugins": [
		// ["transform-es2015-modules-commonjs", {
		//   "allowTopLevelThis": true
		// },],
		
	]
}