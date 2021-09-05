const mysql = require('mysql');


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'biblioteca'
});


conn.connect(() => {
    if(conn) {
        console.log('DB connected');
    }
});

module.exports = conn;