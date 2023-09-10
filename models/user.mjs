import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    position: DataTypes.STRING,
    position_id: DataTypes.INTEGER,
    photo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
