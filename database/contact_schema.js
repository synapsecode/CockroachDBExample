module.exports = (sequelize, DataTypes) => {
    const ContactInfo = sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.INTEGER,
            allowNull:false
        }
    });
    return ContactInfo;
};