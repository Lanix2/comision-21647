const { DataTypes } = require('sequelize');
const { sequelize } = require('./database.js');

const Publicaciones = sequelize.define('Publicaciones', {
    titulo: {
        type: DataTypes.STRING,
    },
    descri: {
        type: DataTypes.STRING,
    },
    link: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
    tableName: 'publicaciones',
});

module.exports = Publicaciones;