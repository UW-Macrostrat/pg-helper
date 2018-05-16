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

  // Standard query
  async query(sql, params) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(sql, params)
      return res.rows
    } catch(e) {
      throw e
    } finally {
      client.release()
    }
  }

  // Return a client. Useful for things like streams. NEED TO RELEASE CLIENT MANUALLY
  async getClient() {
    const client = await this.pool.connect()
    return client
  }

  // Stream a query. Useful for piping to dbgeo or res
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
