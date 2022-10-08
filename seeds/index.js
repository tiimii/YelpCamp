// Requirements
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const nodeFetch = require('node-fetch')
const { createApi } = require('unsplash-js')

// Connecting to database
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected.')
})

// Setting up the Unsplash packages for images
const unsplash = createApi({
    accessKey: 'qkTJ7emoVD75xjnrdHiC4Fj57pNwPpB5jJHrkcBgRh8',
    fetch: nodeFetch
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    // Clear the existing database
    await Campground.deleteMany({})

    // defining how many campgrounds we wish to generate
    const campgroundNumber = 10

    // Get random images from the Unsplash API
    const imageArray = await unsplash.photos.getRandom({
        collectionIds: ['429524'],
        count: campgroundNumber
    })

    // Loop to create random campgrounds
    for (let i = 0; i < campgroundNumber; i++) {
        try {
            const random1000 = Math.floor(Math.random() * 1000)
            const price = Math.floor(Math.random() * 20) + 10
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image: imageArray.response[i].urls.regular,
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis molestiae enim inventore consequatur adipisci. Facere doloremque aliquid sed dicta laborum nemo ratione tempore nisi perspiciatis? Incidunt harum expedita et? Aliquam.',
                price: price
            })
            await camp.save()
        } catch (error) {
            console.log(error)
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log('database updated')
})