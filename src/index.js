import { diffJson } from 'diff';
import chalk from 'chalk';
import { EOL } from 'os';
import isNode from 'detect-node';
import  browser  from 'detect-browser';

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

  if (isNode) {
    console.log(chalk.white(action.type), chalk.green('+' + positive), chalk.red('-' + negative));
    diff.forEach(part => {
      process.stderr.write(chalk[part.color]((part.value)));
    });
    console.log(`${EOL}——————————————————`);
  } else {
    const log = browser.name === 'chrome' ? console.groupCollapsed : console.log;
    log(`${action.type} %c+${positive} %c-${negative}`, 'color: green', 'color: red');
    diff.forEach(part => {
      console.log(`%c${part.value}`, `color: ${part.color}`);
    });
    if(browser.name === 'chrome'){
      console.groupEnd();
    }
  }

  return result;
};

