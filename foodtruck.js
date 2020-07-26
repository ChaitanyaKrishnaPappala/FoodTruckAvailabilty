const request = require('request')
const momentTz = require('moment-timezone')
const {OFFSET_INVALID} = require('./error_constants')

const printFoodTruckData = (offset) => {
    if(isNaN(offset)){
       console.error(OFFSET_INVALID)
    } else {
        fetchFoodTrucksData(offset).then((foodTrucks) => {
            if (foodTrucks && foodTrucks.length > 0) {
                //sort the name alphabetically
                foodTrucks.sort((a, b) => a.applicant < b.applicant ? -1 : (a.applicant > b.applicant ? 1 : 0))
                foodTrucks.forEach((foodTruck) => foodTruck && console.log(`${foodTruck.applicant}      ${foodTruck.location}`))
                console.log('\n')
                console.log('============================================')
                console.log('\n')
                console.log('Press enter to get next set of food trucks')
            } else {
                console.log('\n')
                console.log('========No more food trucks left to display=======')
                console.log('\n')
                process.exit()
            }
        }).catch((ex) => {
            ex && console.error('An error occurred while fetching data, ', ex.toString())
            process.exit()
        })
    }
}

const fetchFoodTrucksData = (offset) => {
    const currentHrs = momentTz.tz(process.env.TIMEZONE).format(process.env.TIME_FORMAT)
    const currenDayNum = momentTz().day()
    return new Promise((resolve, reject)=>{
        if(isNaN(offset)){
            reject(new Error(OFFSET_INVALID))
        } else {
            const options = {
                url: `${process.env.BASE_URL}?$limit=${process.env.LIMIT}&$offset=${offset}&$where=start24<='${currentHrs}' and end24>'${currentHrs}' and dayorder=${currenDayNum}`,
                headers: {
                    'X-App-Token': process.env.TOKEN
                }

            }
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    const info = JSON.parse(body)
                    resolve(info)
                } else {
                    reject(error)
                }
            })
        }
    })
}

module.exports={printFoodTruckData}
