module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define('device', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull:false
        }
    });
    return Device;
};