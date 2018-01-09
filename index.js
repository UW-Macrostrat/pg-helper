const { Pool } = require('pg')
const queryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const { PassThrough } = require('stream')

class pgHelper {
  constructor(credentials, options) {
    this.pool = new Pool(credentials)
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  }
  
  query(sql, params, callback) {
    this.pool.connect((error, client, done) => {
      if (error) return callback(error)
      client.query(sql, params, (err, res) => {
        done()

        if (err) {
          return callback(err.stack)
        }
        callback(null, res.rows)
      })
    })
  }
  
  queryStream(sql, params, raw=false) {
    // a readable stream to return
    let stream
    if (raw) {
      stream = new PassThrough({objectMode: true})
    } else {
      stream = JSONStream.stringify('[', ',', ']')
    }
    
    this.pool.connect((err, client, done) => {
      if (err) throw err
      let query = new queryStream(sql, params)
      let pgStream = client.query(query)

      pgStream.on('end', () => {
        done()
      })
      
      pgStream.pipe(stream)
    })
    return stream
  }
} 

module.exports = pgHelper