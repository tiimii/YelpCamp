// Requirements
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')

// Connecting to database
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected.')
})

// Starting express server
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
    response.render('home')
})

app.get('/makecampground', async (request, response) => {
    const camp = new Campground({title: 'My Backyard', description: 'Cheap camping'})
    await camp.save()
    response.send(camp)
})

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})