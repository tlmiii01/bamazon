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

    // displayAllItems();
    // promptCustomer();
    promptManager();

})

// Function to aske the manager what they would like to do
// List a set of menu options:
function promptManager() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "managerOption",
                message: "What would you like to do?",
                choices: [
                    "View Products",
                    "View Low Quantity Products",
                    "Add Inventory",
                    "Add New Item"
                ]
            }
        ])
        .then((optionResponse) => {
            switch (optionResponse.managerOption) {
                case "View Products":
                    viewAllProducts();
                    break;
                case "View Low Quantity Products":
                    console.log("Not implemented yet...");
                    break;
                case "Add Inventory":
                    console.log("Not implemented yet...");
                    break;
                case "Add New Item":
                    console.log("Not implemented yet...");
                    break;
            }
        })
}

// View Products for Sale
function viewAllProducts() {
    console.log("Got here");
    var query = "SELECT * FROM products";
    connection.query(query, (err, data) => {
        if (err) throw err;
        printTable(data);
    });
};


// View Low Inventory
// Add to Inventory
// Add New Product