const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())
let db = null

const dbPath = path.join(__dirname, 'moviesData.db')

const initializeAndConnectDBWithServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    console.log('Database Has Been Connected')
    app.listen(3000, () => {
      console.log('Server has started in http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Databse error While connecting is ${e.message}`)
  }
}
initializeAndConnectDBWithServer()

//API 1
app.get('/movies/', async (req, res) => {
  const query = `SELECT movie_name as movieName FROM Movie`
  const DBres = await db.all(query)
  res.send(DBres)
})
//API Call 2
app.post('/movies/', async (req, res) => {
  const {directorId, movieName, leadActor} = req.body

  const query = `INSERT INTO Movie (director_id , movie_name , lead_actor) VALUES (? , ? , ?)`
  const DBres = await db.run(query, [directorId, movieName, leadActor])
  res.send('Movie Successfully Adde')
})

// API 3
app.get('/movies/:movieId', async (req, res) => {
  const {movieId} = req.params

  const query = `SELECT

    movie_id as movieId,
    director_id as directorId,
    movie_name as movieName,
    lead_actor as leadActor
    FROM Movie 
    WHERE movie_id = ?`

  const DBres = await db.get(query, movieId)
  res.send(DBres)
  console.log('Successfully loaded')
})

//API 4
app.put('/movies/:movieId', async (req, res) => {
  const {directorId, movieName, leadActor} = req.body
  const {movieId} = req.params
  const Values = [directorId, movieName, leadActor, movieId]

  const query = `UPDATE Movie SET director_id = ? , movie_name = ? , lead_actor = ? WHERE movie_id = ?`

  const DBres = await db.run(query, Values)
  res.send('Movie Details Updated')
  console.log('Movie Details Updated')
})

// API 5
app.delete('/movies/:movieId', async (req, res) => {
  const {movieId} = req.params

  const query = `DELETE FROM Movie WHERE movie_id = ?`

  try {
    await db.run(query, movieId)
    res.send('Movie Removed')
  } catch (error) {
    console.error('Error removing movie:', error)
    res.status(500).send('Error removing movie')
  }
})
