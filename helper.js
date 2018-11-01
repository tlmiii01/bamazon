const { table } = require("table");


// mysql returns an array of objects.  Need to have an array of arrays 
// for the tables npm to work correctly.
function printTable(results) {
    // Convert the array of objectd into an array of arrays.
    var data = [];

    if (results.length > 0) {
        // console.log(results[0]);
        data.push(Object.keys(results[0]));
        for (var item of results) {
            data.push(Object.values(item));
        }

        // console.log(data);
        var output = table(data);
        console.log(output);
    }
}

module.exports = printTable;