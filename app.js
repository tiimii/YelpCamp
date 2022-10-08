// Requirements
const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const path = require('path')
const methodOverride = require('method-override')
const Campground = require('./models/campground')

// Connecting to database
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to the database.')
})

// Starting express server
const app = express()
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
    response.render('home')
})

// Go to all campgrounds page
app.get('/campgrounds', async (request, response) => {
    const campgrounds = await Campground.find({})
    response.render('campgrounds/index', {campgrounds})
})

// Go to add a campground page
app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new')
})

// Add a new campground
app.post('/campgrounds', async (request, response) => {
    const newCampground = new Campground(request.body.campground)
    newCampground.save()
    response.redirect(`/campgrounds/${newCampground._id}`)
})

// go to a specific campground page
app.get('/campgrounds/:id', async (request, response) => {
    const campground = await Campground.findById(request.params.id)
    response.render('campgrounds/show', {campground})
})

// Got to the Edit page
app.get('/campgrounds/:id/edit', async (request, response) => {
    const campground = await Campground.findById(request.params.id)
    response.render('campgrounds/edit', {campground})
})

// Edit Campground
app.put('/campgrounds/:id', async (request, response) => {
    const {id} = request.params
    const campground = await Campground.findByIdAndUpdate(id, {...request.body.campground})
    response.redirect(`/campgrounds/${campground._id}`)
})

// Delete campground
app.delete('/campgrounds/:id', async (request, response) => {
    const {id} = request.params
    await Campground.findByIdAndDelete(id)
    response.redirect('/campgrounds')
})

// 404 route
app.use((request, response) => {
    response.status(404).render('404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})