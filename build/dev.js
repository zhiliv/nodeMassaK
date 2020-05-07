//модуль для автообновления
const nodemon = require('nodemon')
//сборщик
const webpack = require('webpack')
//нстройки сборщика
const config = require('../webpack.config.js')
// запуск nodemon
nodemon('--watch ./dist/main.js --exec "electron ."')

//сборка
const compiler = webpack(config)
compiler.watch({
	aggregateTimeout: 300
}, (err, stats) => {
	if (err) console.log(err)
})
