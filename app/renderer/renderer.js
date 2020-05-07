//Подключение модуль для работы с Electron
const { remote } = require('electron');
//Стартовый файл компилированными скриптами
import './index.html';
//начальный компонент
import AppRoot from './view/index';
window.i18next = remote.getGlobal('i18next');
//рендер компонента
AppRoot.renderSync({}).appendTo(document.body);
