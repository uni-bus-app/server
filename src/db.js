import { mysql } from 'mysql';

const connection = mysql.createConnection({
            host: '35.230.149.136',
            user: 'root',
            password: null,
            database: 'uop_bus'
        });

export class Database {

    constructor() {
    }

    readDB() {
        
        connection.connect((err) => {
        if(err) throw err;
        console.log("connected");
        })

    }

    updateDB() {

    }
    }