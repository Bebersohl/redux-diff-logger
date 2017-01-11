# redux-log-diff

A simple redux middleware that logs changes to the state after every action.

Supports node and browser.

![browser_example](https://cloud.githubusercontent.com/assets/7233925/21834763/7e4bf742-d77d-11e6-94eb-e12c15bf8be2.png)
![node_example](https://cloud.githubusercontent.com/assets/7233925/21834865/1d27d8fe-d77e-11e6-9a63-26fbad2f5d42.png)

## Install

```
$ npm install --save-dev redux-log-diff
```

## Usage
```
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-log-diff';

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```
