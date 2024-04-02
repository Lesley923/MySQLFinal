const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const dataRoot = path.join(path.dirname(__dirname), "data")
const filePaths = ["Hourly_Pitt_040124-043024"].map(file => path.join(dataRoot, file))
const readStreams = filePaths.map(filePath => fs.createReadStream(`${filePath}.json`, { "encoding": "utf-8" }))
const writeStreams = filePaths.map(filePath => fs.createWriteStream(`${filePath}.sql`, { "encoding": "utf-8" }))


const readTasks = readStreams.map(stream => {
    return new Promise((resolve, reject) => {
        let data = ""
        stream.on('data', chunk => data += chunk)
        stream.on('end', () => resolve(data))
        stream.on('error', err => reject(err))
    })
})

/**
 * TODO: 1. Import Defined Schema
 * TODO: 2. Parse Hourly Data and BULK INSERT to mysql
 */
Promise.all(readTasks)
    .then((dataString) => {
        const data = JSON.parse(dataString)
        /**
         * Parse and INSERT to mysql
         */
    }).then(() => {
        readStreams.forEach(stream => stream.close())
        writeStreams.forEach(stream => stream.close())
    })