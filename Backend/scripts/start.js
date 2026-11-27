process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
process.env.PUBLIC_URL = ''

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_PATH = 'build'

async function main() {
  require('module').Module._initPaths()
  require('dotenv').config()

  const path = require('path')

  process.on('unhandledRejection', (err) => {
    console.log('Error :::: ', err)
    // TODO: Add Logger
  })

  const serviceName = process.env.SERVICE || '/rest'
  const servicePath = path.join('..', 'build', 'services', serviceName)

  console.dir({ servicePath }, { depth: null })

  console.log(`Current service: ${serviceName}`)
  console.log(`Started at: ${new Date()}`)
  console.log()

  require(servicePath)
}

main()
