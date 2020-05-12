const { ipcRenderer } = require(`electron`);
var INTERVAL

/*******************************
 ** Инициализация поля выбора  *
 *******************************/
const initSelect = () => {
  M.FormSelect.init(document.querySelector('select'))
}

/********************************
 ** При загрузке документа      *
 ********************************/
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/***********************************
 ** Инициализация модального окна  *
 ***********************************/
const initModal = () => {
  M.Modal.init(document.querySelector('#setting'))
}

/************************************
 ** При открытии формы настроек     *
 ************************************/
document.querySelector('#open-setting').addEventListener('click', () => {
  let setting = ipcRenderer.sendSync('getSetting')
  setting = JSON.parse(setting)
  document.querySelector('#ip-adress').value = setting.ipAdress
  document.querySelector('#port').value = setting.port
})


/***************************
 ** При сохранении настрое *
 ***************************/
document.querySelector('#save-setting').addEventListener('click', () => {
  let obj = {
    ipAdress: document.querySelector('#ip-adress').value,
    port: document.querySelector('#port').value
  }
  let res = ipcRenderer.sendSync('save-setting', obj)
  if(res == null){
  M.toast({html: 'Данные успешно сохранены'})
  }
  else{
    M.toast({html: `Произошла ошибка ${res}`})
  }
})


/**********************************
 ** При нажатии на кнопку Play    *
 **********************************/
document.getElementById('play').addEventListener('click', () => {
  let interval = document.querySelector('#interval').value
  console.log('interval', interval)
  let tmr = 0 
  let typeInterval = document.querySelector('.typeInterval select').value
  if(typeInterval == 1){
    tmr = 1000 * interval
  }
  else if(typeInterval == 2){
    tmr = 60000 * interval
  }
  else{
    tmr = 1440000 * interval
  }
  document.querySelector('.stop').disabled = false;
  document.getElementById('play').disabled = true;
  document.querySelector('tbody').innerHTML = ''
  let StartData = ipcRenderer.sendSync('getWeigth')
  if(StartData.type == 'error'){
    M.toast({html: 'Устройство не подклчюено'})
  }
  else{
    setTable(StartData)
    INTERVAL = setInterval(()=> {
      let data = ipcRenderer.sendSync('getWeigth')
      if(data.type == 'error'){
        M.toast({html: 'Устройство не подклчюено'})
      }
      else{
      setTable(data)
      document.querySelector('tbody').scrollTop = 9999
      }
    }, tmr)
  }
  


})

/***************************
 ** Заполнение таблицы     *
 ***************************/
const setTable = (data) => {
  let el = document.createElement('tr')
  el.innerHTML = `
  <td>${data.ind}</td>
  <td>${data.time}</td>
  <td>${data.weigth}</td>
`
  document.querySelector('tbody').appendChild(el);
}

/********************************
 ** При нажатии на кнопку СТОП  *
 ********************************/
document.querySelector('.stop').addEventListener('click', () => {
  clearInterval(INTERVAL)
  document.getElementById('play').disabled = false;
  document.querySelector('.stop').disabled = true;
})

/************************
 ** При вооде интервала *
 ************************/
document.getElementById('interval').addEventListener('keyup', () => {
  if(document.getElementById('interval').value != ''){
    document.getElementById('play').disabled = false
  }
  else{
    document.getElementById('play').disabled = true
  }
})

/**************************************
 ** При нажатии на копку подключитьн  *
 **************************************/
document.querySelector('.connect').addEventListener('click', () => {
  let connect = ipcRenderer.sendSync('connect');
if(connect == 0 ){
  document.getElementById('interval').disabled = false;
  let status = document.querySelector('#status')
  status.innerHTML = 'Подключено'
  status.classList.remove('off')
  status.classList.add('on')
  setInterval(async () => {
    let res = await ipcRenderer.sendSync('getWeigth')
    document.getElementById('currentWeight').innerHTML  = String(res.weigth)
  }, 1000);
}
})

ready(initSelect)
ready(initModal)
