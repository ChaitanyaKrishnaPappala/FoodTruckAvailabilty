require('dotenv').config()
const {printFoodTruckData} = require('./foodtruck')
const stdin = process.openStdin()


let offset = 0

// initially print 10
printFoodTruckData(offset)

// on each enter print another 10
stdin.on('data', function() {
    offset += +process.env.OFFSET_INC
    printFoodTruckData(offset)
})
