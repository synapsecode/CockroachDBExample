module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('person', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull:false,
        }
    });
    return Person;
};