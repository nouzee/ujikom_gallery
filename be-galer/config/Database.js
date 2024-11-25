import { Sequelize } from "sequelize";

const db = new Sequelize('be-galer', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;