var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId );

    displayAllItems();
    
})

function displayAllItems() {
    connection.query("SELECT * FROM products", (err, result) => {
        if (err) throw err;
        console.log(result);

        for (var item of result) {
            console.log(item.product_name);
        }
        connection.end();
    })
}