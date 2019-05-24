module.exports = {
    connectionDB() {
        // "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
    	// conString = "postgres://msalam:msalam@localhost:5432/postgres"
    	conString = "postgres://postgres:root@localhost:5432/postgres"
        // config = {
        //     host: '23.96.86.57',
        //     user: 'postgres',
        //     password: '!pass@semusi#2018',
        //     database: 'postgres',
        //     port: 5432,
        //     ssl: false
        // };
        return conString;
    }
}