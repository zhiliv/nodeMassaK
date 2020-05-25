

/** Модуль для главгой формы
 * @module
 * @member index
 */

'use strict';

//корневой каталог приложения
const appRoot = require('app-root-path');

/* Отслеживание загрузки документа */
document.onreadystatechange = () => {
	//проверка состиояния страницы
	if (document.readyState == 'complete') {
		//подключение jquery
		const $ = require(`jquery`);
		//при загрузке страницы jquery
		$(document).ready(async () => {
      await require(`./js/func.js`);
		});
	}
};

