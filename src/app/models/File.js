import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
        name: {
          singular: "file",
          plural: "files",
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.User);
  }
}

export default File;
