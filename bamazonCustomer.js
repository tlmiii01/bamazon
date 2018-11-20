var mysql = require("mysql");
var inquirer = require("inquirer");
// const { table } = require("table");
var printTable = require("./helper");

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

    displayAllItems();

})

function displayAllItems() {
    connection.query("SELECT * FROM products", (err, result) => {
        if (err) throw err;
        printTable(result);
        promptCustomer();
    })
};

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
    connection.query("SELECT item_id, price, stock_quantity FROM products WHERE item_id = ?",
                     [id],
                     (err, res) => {
                         if (err) throw err;
                         
                         quantity = parseInt(quantity);
                         // If result is empty, item does not exist.
                         if (res.length === 0) {
                             return console.log("Item does not exist!");
                         } else if (res[0].stock_quantity < quantity) {
                             return console.log("We do not have the stock to fulfill that order");
                         } else {
                            //  console.log("remove from stock here!");
                            //  console.log(res);

                             var newQuantity = res[0].stock_quantity - quantity;
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
                                 console.log("$" + (quantity * res[0].price) + " spent on purchase.");
                             })
                         }
                         
                     })
}