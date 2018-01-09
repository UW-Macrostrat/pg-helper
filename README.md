# pg-helper

Boilerplate for working with Postgres in Node

## Installation

````
npm install --save @macrostrat/pg-helper
````

## Usage

````javascript
const pgHelper = require('@macrostrat/pg-helper')

let pg = new pgHelper({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  database: 'database'
})

pg.query('SELECT pork FROM pig WHERE fatty = $1', [ true ], (error, result) => {
   // result 
})

pg.queryStream('SELECT ice_cream FROM freezer WHERE flavor = $1', [ 'chocolate' ]))
  .pipe(fs.createWriteStream('./treats.txt'))
````

## API

#### query(sql, params, callback(error, rows))

#### queryStream(sql, params)


## License
MIT