import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';

const server = express();
const port = process.env.PORT || 3000;

server.get('/', async (req, res, next) => {
    try {
        const row = await db.get(`SELECT * FROM tableName WHERE id = ?`, 123);
        res.send(`Hello, ${row.columnName}!`);
    } catch (err) {
        next(err);
    }
});

db.open('./db.sqlite', {verbose: true, Promise})
    .catch(err => console.error(err))
    .finally(() => {
        server.listen(port, () => {
            console.log(`Node.js app is running at http://localhost:${port}/`);
        });
    });



/*
* 依赖
*
* .babelrc
*
* {
*  "presets": [
*  "es2015",
*  "stage-3"
*  ],
*  "plugins": [
*  "transform-runtime"
*  ]
* }
*
* https://stackoverflow.com/questions/28708975/transpile-es7-async-await-with-babel-js
*
* npm install babel-cli
* npm install babel-plugin-syntax-async-functions
* npm install babel-preset-stage-3
* npm install babel-plugin-transform-runtime
* npm install babel-preset-es2015
*
* npm install sqlite -python=python2的路径
*
*
*
* */


