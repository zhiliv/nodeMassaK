const { app, BrowserWindow } = require('electron');
const path = require('path');
const moment = require('moment');
if (require('electron-squirrel-startup')) {
	app.quit();
}
try {
	require('electron-reloader')(module);
} catch (_) {}
const { ipcMain } = require('electron');
const fs = require('fs');
var winax = require('winax');
var AXO = require('axo');
var con = new AXO('MassaKDriver100.Scales');
var CONNECT
var IND = 0

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, './js/render.js'),
		},
		autoHideMenuBar: true,
	});

	mainWindow.loadFile(path.join(__dirname, 'index.html'));
	mainWindow.webContents.openDevTools();
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

require('electron-reload')(__dirname);
if (require('electron-squirrel-startup')) {
	app.quit();
}

ipcMain.on('getSetting', async (event, arg) => {
	event.returnValue = await fs.readFileSync('config/config.json').toString();
});

ipcMain.on('save-setting', (event, arg) => {
	fs.writeFile('config/config.json', JSON.stringify(arg), (err) => {
		event.returnValue = err;
	});
});

ipcMain.on('getWeigth', (event, arg) => {
  IND++
  if(CONNECT == 0){
    con.ReadWeight
    let result = {type: 'success', time: moment().format('YYYY.MM.DD HH:mm:ss'),
    weigth: con.Weight,
    ind: IND
  };
  event.returnValue = result;
  }
 else{
   let result = {type: 'error'}
   event.returnValue = result;
 }

});

ipcMain.on('connect', (event, arg) => {
  let param =  JSON.parse(fs.readFileSync('config/config.json').toString())
  con.Connection =  `${param.ipAdress}:${param.port}`
  CONNECT = con.OpenConnection
  IND = 0
  event.returnValue = CONNECT
})