// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const moment = require('moment');
const  ipcMain  = require('electron').ipcMain;
const fs = require('fs');
const  electron  = require('electron')


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('getSetting', async (event, arg) => {
	let data = JSON.parse(await fs.readFileSync('config/config.json').toString())
	event.returnValue = { server: `http://${data.server}:${data.port}`, numWeith: data.numWeith };
});

ipcMain.on('save-setting', (event, arg) => {
	fs.writeFile('config/config.json', JSON.stringify(arg), (err) => {
		event.returnValue = err;
	});
});

ipcMain.on('getWeigth', (event, arg) => {
	IND++
	if (CONNECT == 0) {
		con.ReadWeight
		let result = {
			type: 'success', time: moment().format('YYYY.MM.DD HH:mm:ss'),
			weigth: con.Weight,
			ind: IND
		};
		event.returnValue = result;
	}
	else {
		let result = { type: 'error' }
		event.returnValue = result;
	}

});



ipcMain.on('connect', (event, arg) => {
	let param = JSON.parse(fs.readFileSync('config/config.json').toString())
	con.Connection = `${param.ipAdress}:${param.port}`
	CONNECT = con.OpenConnection
	IND = 0
	event.returnValue = CONNECT
})

console.log(path.parse(process.cwd()).root)

ipcMain.on('excel', (event, arg) => {
	const moment = require('moment')
	var data = '';
	for (var i = 0; i < arg.length; i++) {
		data = data + arg[i].ind + '\t' + arg[i].date + '\t' + arg[i].weigth + '\n';
	}
	var mkdirp = require('mkdirp');
	mkdirp(`${path.parse(process.cwd()).root}/МассаК`);
	let filename = moment().format('DD-MM-YY HH-mm')
	fs.appendFile(`${path.parse(process.cwd()).root}//МассаК//${filename}.xls`, data, (err) => {
		if (err) throw err;
		console.log('File created');
	});
	event.returnValue = ''
})