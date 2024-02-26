const express = require('express')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')

const app = express()
app.use(express.json())

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

//CREATE A PLAYER { API 2 }

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const addPlayerQuery = `
    INSERT INTO 
      cricket_team (player_name,jersey_number,role)
    VALUES
    (
     '${playerName}',
      ${jerseyNumber},
     '${role}'
    );`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

//API 3 --> GET a playerList

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const playerQuery = `
  SELECT *
  FROM 
    cricket_team
  WHERE 
    player_id = ${playerId};`

  const player = await db.get(playerQuery)
  response.send(player)
})

//API 4 --> PUT a player

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const updateQuery = `
  UPDATE 
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE 
    player_id = ${playerId};
  `
  await db.run(updateQuery)
  response.send('Player Details Updated')
})

//API 5 -> Delete the player

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE FROM 
    cricket_team
  WHERE 
    player_id = ${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})
