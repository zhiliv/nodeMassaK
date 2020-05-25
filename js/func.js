const ipcRenderer  = require(`electron`).ipcRenderer;
const electron  = require(`electron`)

var INTERVAL;

const $ = require('jquery');
const moment = require('moment');

/*******************************
 ** Инициализация поля выбора  *
 *******************************/
const initSelect = () => {
	M.FormSelect.init(document.querySelector('select'));
};

$(document).ready(() => {
	setInterval(async () => {
		let weigth;
		await GetWeight(numWeith).then((res) => {
			$('#currentWeight').text(res);
		});
	}, 1000);
});

let setting = ipcRenderer.sendSync('getSetting');

// Очистка сообщений
function ExecuteClearMessage() {

}

// Общая функция вызова API Unit-server-а
// Будет использоватся во всех примерах
var UrlServer = setting.server; // HTTP адрес сервера торгового оборудования, если пусто то локальный вызов
var User = 'user'; // Пользователь доступа к серверу торгового оборудования
var Password = 'user'; // Пароль доступа к серверу торгового оборудования
var numWeith = setting.numWeith;

function ExecuteCommand(Data, FunSuccess, FunError, timeout, ClearMessage) {
	if (FunSuccess == undefined) {
		FunSuccess = ExecuteSuccess;
	}
	if (FunError == undefined) {
		FunError = ErrorSuccess;
	}
	if (timeout == undefined) {
		timeout = 60000; //Минута - некоторые драйверы при работе выполняют интерактивные действия с пользователем - тогда увеличьте тайм-аут.
	}

	if (ClearMessage == undefined || ClearMessage == true) {
		ExecuteClearMessage();
	}

	var JSon = JSON.stringify(Data);

	$.support.cors = true;
	var jqXHRvar = $.ajax({
		type: 'POST',
		timeout: timeout,
		url:
			UrlServer +
			(UrlServer == ''
				? window.location.protocol + '//' + window.location.host + '/'
				: '/') +
			'Execute',
		crossDomain: true,
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
		data: JSon,
		headers:
			User !== '' || Password !== ''
				? { Authorization: 'Basic ' + btoa(User + ':' + Password) }
				: '',
		success: FunSuccess,
		error: FunError,
	});
	return jqXHRvar;
}

// Функция вызываемая при ошибке передачи данных
function ErrorSuccess(jqXHR, textStatus, errorThrown) {
	$('#MessageStatus').text(textStatus);
	$('#MessageError').text('Ошибка передачи данных по HTTP протоколу');
}
// Функция вызываемая после обработки команды - обработка возвращаемых данных
// Здесь можно посмотреть как получить возвращаемые данные
function ExecuteSuccess(Rezult, textStatus, jqXHR) {
	//----------------------------------------------------------------------
	// ОБЩЕЕ
	//----------------------------------------------------------------------
	if (Rezult.Status == 0) {
		MessageStatus = 'Ok';
	} else if (Rezult.Status == 1) {
		MessageStatus = 'Выполняется';
	} else if (Rezult.Status == 2) {
		MessageStatus = 'Ошибка!';
	} else if (Rezult.Status == 3) {
		MessageStatus = 'Данные не найдены!';
	}
	// Текст ошибки
	MessageError = Rezult.Error;

	//----------------------------------------------------------------------
	// Фискальные регистраторы
	//----------------------------------------------------------------------
	// Номер чека
	var MessageCheckNumber = Rezult.CheckNumber;
	// Номер смены
	var MessageSessionNumber = Rezult.SessionNumber;
	// Количество символов в строке
	var MessageLineLength = Rezult.LineLength;
	// Сумма наличных в ККМ
	var MessageAmount = Rezult.Amount;
}
// Герерация GUID
function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	);
}

const GetWeight = async (NumDevice) => {
	// Подготовка данных команды
	var Data = {
		// Команда серверу
		Command: 'GetWeight',
		// Номер устройства. Если 0 то первое не блокированное на сервере
		NumDevice: NumDevice,
	};
	// Вызов команды
	let Weight = null;
	while (true) {
		await ExecuteCommand(Data).then(async (res) => {
			Weight = res.Weight;
		});
		if (Weight != null && Weight != 66666.6666) {
			break;
		}
	}

	return Weight;
};

/********************************
 ** При загрузке документа      *
 ********************************/
function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

/***********************************
 ** Инициализация модального окна  *
 ***********************************/
const initModal = () => {
	M.Modal.init(document.querySelector('#setting'));
};

/************************************
 ** При открытии формы настроек     *
 ************************************/
document.querySelector('#open-setting').addEventListener('click', () => {
	let setting = ipcRenderer.sendSync('getSetting');
	let server = setting.server.replace('http://', '');
	server = server.split(':');
	server[0] != undefined
		? (document.querySelector('#ip-adress').value = server[0])
		: (document.querySelector('#ip-adress').value = '');
	server[1] != undefined
		? (document.querySelector('#port').value = server[1])
		: (document.querySelector('#port').value = '');
	setting.numWeith != undefined
		? (document.querySelector('#numWeith').value = setting.numWeith)
		: (document.querySelector('#numWeith').value = '');
});

/***************************
 ** При сохранении настрое *
 ***************************/
document.querySelector('#save-setting').addEventListener('click', () => {
	let obj = {
		server: document.querySelector('#ip-adress').value,
		port: document.querySelector('#port').value,
		numWeith: document.querySelector('#numWeith').value,
	};
	let res = ipcRenderer.sendSync('save-setting', obj);
	if (res == null) {
		M.toast({ html: 'Данные успешно сохранены' });
	} else {
		M.toast({ html: `Произошла ошибка ${res}` });
	}
});

let unit;

/**********************************
 ** При нажатии на кнопку Play    *
 **********************************/
document.getElementById('play').addEventListener('click', async () => {
	let interval = document.querySelector('#interval').value;
	let tmr = 0;
	let typeInterval = document.querySelector('.typeInterval select').value;
	if (typeInterval == 1) {
		tmr = 1000 * interval;
		unit = 'с.';
	} else if (typeInterval == 2) {
		tmr = 60000 * interval;
		unit = 'м.';
	} else {
		tmr = 1440000 * interval;
		unit = 'ч.';
	}
	document.querySelector('.stop').disabled = false;
	document.getElementById('play').disabled = true;
	document.querySelector('tbody').innerHTML = '';
	$('.time').text(`1${unit}`);

	let weigth;
	await GetWeight(numWeith).then((res) => {
		weigth = res;
	});
	let IND = 1;
	let date = moment().format('DD.MM.YYYY HH:mm:ss');
	let StartData = weigth;
	setTable(IND, date, StartData);
	INTERVAL = setInterval(async () => {
		await GetWeight(numWeith).then((res) => {
			weigth = res;
		});
		IND++;
		date = moment().format('DD.MM.YYYY HH:mm:ss');
		setTable(IND, date, weigth);
		$('.time').text(`${IND}${unit}`);
		document.querySelector('tbody').scrollTop = 9999999999999999999;
	}, tmr);
});

/***************************
 ** Заполнение таблицы     *
 ***************************/
const setTable = (ind, date, weigth) => {
	let el = document.createElement('tr');
	el.innerHTML = `
  <td class="ind">${ind}</td>
  <td class="date">${date}</td>
  <td class="weigth">${weigth}</td>
`;
	document.querySelector('tbody').appendChild(el);
};

/********************************
 ** При нажатии на кнопку СТОП  *
 ********************************/
document.querySelector('.stop').addEventListener('click', () => {
	clearInterval(INTERVAL);
	document.getElementById('play').disabled = false;
	document.querySelector('.stop').disabled = true;
});

/************************
 ** При вооде интервала *
 ************************/
document.getElementById('interval').addEventListener('keyup', () => {
	if (document.getElementById('interval').value != '') {
		document.getElementById('play').disabled = false;
	} else {
		document.getElementById('play').disabled = true;
	}
});

document.querySelector('#clear').addEventListener('click', () => {
	$('tbody').empty();
});

document.querySelector('#excel').addEventListener('click', () => {
	let arr = [];
	$('tbody tr').each((ind, row) => {
		let obj = {
			ind: $(row).find('.ind').text(),
			date: $(row).find('.date').text(),
			weigth: $(row).find('.weigth').text(),
		};
		arr.push(obj);
	});
	ipcRenderer.sendSync('excel', arr);
});

ready(initSelect);
ready(initModal);
