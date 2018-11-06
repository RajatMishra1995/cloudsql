/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Require process, so we can mock environment variables
const process = require('process');

// [START gae_flex_mysql_app]
const express = require('express');
const Knex = require('knex');
const crypto = require('crypto');
const rn = require('random-number');
const bodyParser = require('body-parser');

const app = express();
app.enable('trust proxy');

const knex = connect();

function connect () {
  // [START gae_flex_mysql_connect]
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  };

  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  // Connect to the database
  const knex = Knex({
    client: 'mysql',
    connection: config
  });
  // [END gae_flex_mysql_connect]

  return knex;
}

var options = {
     min:  0,
     max:  100000,
     integer: true
};


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Database name : movies \nTable : Persons (PersonID, LastName, FirstName, Address, City) \nPlease visit /insert to insert');
});


app.get('/insert', (req, res) => {

    const rand = rn(options);

    const persons = [{PersonID : rand, LastName : 'Mishra', FirstName : 'Rajat', Address : 'address', City : 'Lucknow'}];

    knex('Persons').insert(persons).then(() => {
        console.log('Insertion successful');
    }).catch((err) => {console.log(err); throw err; });

    res.send(`inserted ${rand}`);
    
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_mysql_app]

module.exports = app;
