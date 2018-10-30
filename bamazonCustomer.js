var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require("table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);

    // displayAllItems();
    promptCustomer();

})

function displayAllItems() {
    connection.query("SELECT * FROM products", (err, result) => {
        if (err) throw err;
        // console.log(result);

        // for (var item of result) {
        //     console.log(item.product_name);
        // }

        printTable(result);

        connection.end();
    })
};

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

function promptCustomer() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "purchaseItem",
                message: "Which item would you like to buy?"
            },
            {
                type: "input",
                name: "purchaseQuantity",
                message: "How many would you like to buy?"
            }
        ])
        .then((answers) => {
            buyItem(answers.purchaseItem, answers.purchaseQuantity);
        }); 
}

function buyItem(id, quantity) {
    // Query the item from the database and see if it exists.
    connection.query("SELECT item_id, stock_quantity FROM products WHERE item_id = ?",
                     [id],
                     (err, res) => {
                         if (err) throw err;
                         
                         // If result is empty, item does not exist.
                         if (res.length === 0) {
                             return console.log("Item does not exist!");
                         } else if (res[0].stock_quantity < parseInt(quantity) ) {
                             return console.log("We do not have the stock to fulfill that order");
                         } else {
                            //  console.log("remove from stock here!");
                            //  console.log(res);

                             var newQuantity = res[0].stock_quantity - parseInt(quantity);
                             connection.query("UPDATE products SET ? WHERE ?",
                             [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: id
                                }
                             ],
                             (err, result) => {
                                 if (err) throw error;
                                 console.log("Updated stock");
                             })
                         }
                         
                     })
}