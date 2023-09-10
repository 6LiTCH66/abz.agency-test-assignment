import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import configJson from '../config/config.json' assert {type: "json"};
import UserModel from "./user.mjs"
import PositionsModel from "./position.mjs"
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = configJson[env];
const basename = path.basename(import.meta.url); // Use import.meta.url to replace __filename
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = UserModel(sequelize)
const Positions = PositionsModel(sequelize)

const modelFiles = fs
    .readdirSync(new URL('.', import.meta.url)) // Use new URL() to replace __dirname
    .filter(file => (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
    ));

Promise.all(modelFiles.map(file => import(path.join(new URL('.', import.meta.url).pathname, file))))
    .then(modules => {
      modules.forEach(module => {
        const model = module.default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });

      Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
          db[modelName].associate(db);
        }
      });

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;
    });

export {User, Positions, db};
