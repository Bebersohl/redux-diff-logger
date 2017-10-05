import { diffJson } from 'diff';
import chalk from 'chalk';
import { EOL } from 'os';
import isNode from 'detect-node';
import browser from 'detect-browser';

export default store => next => action => {
  const currentState = store.getState();
  const result = next(action);
  const nextState = store.getState();
  const diff = diffJson(currentState, nextState);
  let positive = 0;
  let negative = 0;

  diff.forEach(part => {
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

  const logForChrome = function () {
    console.groupCollapsed(`${action.type} %c+${positive} %c-${negative}`, 'color: green', 'color: red');
    diff.forEach(part => {
      console.log(`%c${part.value}`, `color: ${part.color}`);
    });
    console.groupEnd();
  };
  const logForIE = function () {
    console.groupCollapsed(`${action.type} +${positive} -${negative}`);
    diff.forEach(part => {
      console.log(`${part.value}`);
    });
    console.groupEnd();
  };
  const logForOther = function () {
    console.log(`${action.type} +${positive} -${negative}`);
    diff.forEach(part => {
      console.log(`%c${part.value}`, `color: ${part.color}`);
    });
  };
  if (isNode) {
    console.log(chalk.white(action.type), chalk.green('+' + positive), chalk.red('-' + negative));
    diff.forEach(part => {
      process.stderr.write(chalk[part.color]((part.value)));
    });
    console.log(`${EOL}——————————————————`);
  } else {
    if (browser.name === 'chrome') { // eslint-disable-line
      logForChrome();
    } else if (browser.name === 'ie') {
      logForIE();
    } else {
      logForOther();
    }
  }

  return result;
};

