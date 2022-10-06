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
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
    response.render('home')
})

app.get('/campgrounds', async (request, response) => {
    const campgrounds = await Campground.find({})
    response.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new')
})

app.post('/campgrounds', async (request, response) => {
    const newCampground = new Campground(request.body.campground)
    newCampground.save()
    response.redirect(`campgrounds/${newCampground._id}`)
})

app.get('/campgrounds/:id', async (request, response) => {
    const campground = await Campground.findById(request.params.id)
    response.render('campgrounds/show', {campground})
})

app.get('/campgrounds/:id/edit', async (request, response) => {
    const campground = await Campground.findById(request.params.id)
    response.render('campgrounds/edit', {campground})
})

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})