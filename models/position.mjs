import { Model, DataTypes } from 'sequelize';


export default (sequelize) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Position.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Position',
    timestamps: true
  });
  return Position;
}

