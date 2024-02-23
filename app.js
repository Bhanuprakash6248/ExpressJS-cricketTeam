const express = require('express')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')

const app = express()

let db = null
const dbPath = path.join(__dirname, 'cricketTeam.db')

//Initalising the DB and Server

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

//Get all lists

app.get('/players/', async (request, response) => {
  const getListsQuery = `
  SELECT *
  FROM cricket_team;
  `
  const listArray = await db.all(getListsQuery)
  response.send(listArray)
})

module.exports = app
