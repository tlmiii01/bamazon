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
                    viewLowInventory();
                    break;
                case "Add Inventory":
                    addInventory();
                    break;
                case "Add New Item":
                    console.log("Not implemented yet...");
                    break;
            }
        })
}

// View Products for Sale
function viewAllProducts() {
    // console.log("Got here");
    var query = "SELECT * FROM products";
    connection.query(query, (err, data) => {
        if (err) throw err;
        printTable(data);
    });
};

// View Low Inventory (less than five itesms)
function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 6";
    connection.query(query, (err, data) => {
        if (err) throw err;
        printTable(data);
    });
};

// Add to Inventory
function addInventory() {
    // Use inquirer to get the id and amount to add.
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "ID number you would like to modify: "
            },
            {
                name: "quantity",
                type: "input",
                message: "Number of items to add (Negative number to remove): "
            }
        ])
        .then( ( answers ) => {
            let itemID = parseInt(answers.id);
            let itemQuantity = parseInt(answers.quantity);

            // Check if the item exists
            var query = "SELECT * FROM products WHERE item_id = ?";
            connection.query(query, [itemID], (err, data) => {
                if (data.length === 0) {
                    return console.log("Item does not exist...");
                } else {
                    itemQuantity += data[0].stock_quantity;
                    query = "UPDATE products SET ? WHERE ?";
                    connection.query( query,
                    [
                        {
                            stock_quantity: itemQuantity
                        },
                        {
                            item_id: itemID
                        }
                    ],
                    (err, data2) => {
                        if (err) throw err;
                        console.log("Quantity updated!");
                        viewAllProducts();
                    })
                }
            })
        })
}
// Add New Product