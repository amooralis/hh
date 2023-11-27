// psql -U postgres
// CREATE DATABASE hh;
// npm i sequelize
// npm i sequelize-cli
// npm i pg
// # yarn sequelize-cli init

const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("hh", "postgres", "21082001", {
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5432,
});

const User = sequelize.define(
    "User",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isWorker: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


const Vacancy = sequelize.define(
    "Vacancy",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        english_lvl: {
            type: Sequelize.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
            allowNull: false,
        },
        grade: {
            type: Sequelize.ENUM('Intern', 'Junior', 'Middle', 'Senior', 'TeamLead'),
            allowNull: false,
        },
        tags: {
            type: Sequelize.ARRAY(Sequelize.ENUM('Frontend', 'Backend', 'JS', 'Go', 'React.js', 'Node.js', 'Java', 'Python', 'SQL')),
            allowNull: false,
        },
        salary: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

const WorkerVacancy = sequelize.define(
    "WorkerVacancy",
    {
        workerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        vacancyId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


User.belongsToMany(Vacancy, {
    through: 'WorkerVacancy',
    foreignKey: 'workerId',
});


Vacancy.belongsToMany(User, {
    through: 'WorkerVacancy',
    foreignKey: 'vacancyId',
});

Vacancy.hasMany(WorkerVacancy, {foreignKey: 'vacancyId'});
WorkerVacancy.belongsTo(Vacancy, {foreignKey: 'vacancyId'});


module.exports = {
    User,
    Vacancy,
    WorkerVacancy,
};

