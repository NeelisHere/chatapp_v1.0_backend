const colors = require('colors')
module.exports = {
    break_point: (x) => {
        console.log(colors.red.underline(`breakpoint-${x}`))
    }
}

