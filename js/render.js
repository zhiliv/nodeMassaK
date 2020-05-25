/* Отслеживание загрузки документа */
document.onreadystatechange = () => {
	//проверка состиояния страницы
	if (document.readyState == 'complete') {
		//подключение jquery
		const $ = require(`jquery`);
		//при загрузке страницы jquery
		$(document).ready(async () => {
	
				//подключение функций для панели управления
				//выполнение функций при загрузке страницы
				require(`./func.js`);
				require('./jquery.json.min')
		});
	}
};
