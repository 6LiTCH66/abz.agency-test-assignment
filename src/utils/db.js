import { Sequelize } from 'sequelize';
import jsonConfig from '../../config/config.json' assert { type: 'json' };

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = jsonConfig[env];

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

export default sequelize;
