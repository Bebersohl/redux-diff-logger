Object.defineProperty(exports, "__esModule", {
	value: true
});

var _diff = require('diff');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _os = require('os');

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _detectBrowser = require('detect-browser');

var _detectBrowser2 = _interopRequireDefault(_detectBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (store) {
	return function (next) {
		return function (action) {
			var currentState = store.getState();
			var result = next(action);
			var nextState = store.getState();
			var diff = (0, _diff.diffJson)(currentState, nextState);
			var positive = 0;
			var negative = 0;

			diff.forEach(function (part) {
				if (part.added) {
					part.color = 'green';
					positive += 1;
				} else if (part.removed) {
					part.color = 'red';
					negative += 1;
				} else {
					part.color = 'grey';
				}
			});

			var logForChrome = function logForChrome() {
				console.groupCollapsed(action.type + ' %c+' + positive + ' %c-' + negative, 'color: green', 'color: red');
				diff.forEach(function (part) {
					console.log('%c' + part.value, 'color: ' + part.color);
				});
				console.groupEnd();
			};
			var logForIE = function logForIE() {
				console.groupCollapsed(action.type + ' +' + positive + ' -' + negative);
				diff.forEach(function (part) {
					console.log('' + part.value);
				});
				console.groupEnd();
			};
			var logForOther = function logForOther() {
				console.log(action.type + ' +' + positive + ' -' + negative);
				diff.forEach(function (part) {
					console.log('%c' + part.value, 'color: ' + part.color);
				});
			};
			if (_detectNode2.default) {
				console.log(_chalk2.default.white(action.type), _chalk2.default.green('+' + positive), _chalk2.default.red('-' + negative));
				diff.forEach(function (part) {
					process.stderr.write(_chalk2.default[part.color](part.value));
				});
				console.log(_os.EOL + '\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014');
			} else {
				if (_detectBrowser2.default.name === 'chrome') {
					logForChrome();
				} else if (_detectBrowser2.default.name === 'ie') {
					//logForIE();
					logForChrome();
				} else {
					logForOther();
				}
			}

			return result;
		};
	};
};