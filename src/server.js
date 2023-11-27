const {Sequelize} = require("sequelize");
const express = require('express');
const PORT = 3456;
const app = express();
const cors = require("cors");
const path = require('path');
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const {User, Vacancy, WorkerVacancy} = require('../models/index');


// Middleware для обработки CORS и префлайт запросов
app.use(cors({
    origin: 'http://localhost:3000', // Укажите источник вашего клиента
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Добавьте 'OPTIONS' для префлайт
}));

app.options('*', cors());
// app.use(cors());
app.use(express.json());
// app.set('view engine', 'hbs')
app.use(express.static('public'))

const sequelize = new Sequelize("hh", "postgres", "21082001", {  // поменять пароль
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5432,
});

app.use(session({
    secret: "alisa",
    resave: false,
    saveUnititialized: true,
    cookie: {
        secure: false, // Установите в true, если используете HTTPS
        httpOnly: true,
    },
    store: new FileStore()
}))

const isAuth = (req, res, next) => {
    if (req.session.userid) {
        next();
    } else {
        res.redirect("/login");
    }
}

sequelize.authenticate()
    .then(() => {
        console.log('Успешное подключение к базе данных');
    })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
    });

User.sync();
Vacancy.sync();
WorkerVacancy.sync();


sequelize.sync()
    .then(() => {
        console.log('Модели синхронизированы с базой данных');
    })
    .catch(err => {
        console.error('Ошибка синхронизации моделей:', err);
    });

sequelize.getQueryInterface().showAllTables().then(tableNames => {
    console.log("Список таблиц в базе данных:", tableNames);
});


app.post("/signup", async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

app.post("/login", async (req, res) => {
    let user = await User.findOne({
        where: {
            login: req.body.login,
            password: req.body.password,
        }
    });
    if (user) {
        req.session.userid = user.id;
        req.session.login = user.login;
        req.session.isWorker = user.isWorker;
        res.json(user);
    } else {
        res.status(403).json({message: "неверно"});
    }
});

app.get("/logout", async (req, res) => {
    req.session.destroy();
    res.status(200).json({message: "произведён выход"});
});


app.post("/vacancies", async (req, res) => {
    if (req.body.isWorker === 'false') {
        const newVacancy = await Vacancy.create({
            company_id: req.body.company_id,
            status: true,
            title: req.body.title,
            description: req.body.description,
            english_lvl: req.body.english_lvl,
            grade: req.body.grade,
            tags: req.body.tags,
            salary: req.body.salary,
        });
        res.json(newVacancy);
    } else {
        res.status(403).json({message: req.session.isWorker});
    }
})

app.get("/vacancies", async (req, res) => {
    try {
        let vacancies;

        if (req.query.isWorker === "true") {
            vacancies = await Vacancy.findAll();
        } else {
            vacancies = await Vacancy.findAll({where: {company_id: req.query.userId}});
        }

        console.log(vacancies);
        res.json(vacancies);
    } catch (error) {
        console.error("Error retrieving vacancies:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


app.get("/activevacancies", async (req, res) => {
    const vacancies = await Vacancy.findAll({where: {status: true, company_id: req.query.userId}});
    res.json(vacancies);
});

app.get("/allactivevacancies", async (req, res) => {
    const vacancies = await Vacancy.findAll({where: {status: true}});
    res.json(vacancies);
});

app.get("/vacancies/:id", async (req, res) => {
    const id = req.params.id;
    const vacancy = await Vacancy.findOne({where: {id}});
    res.json(vacancy);
});

app.put("/vacancies/:id", async (req, res) => {
    const id = req.params.id;
    const vacancy = await Vacancy.update(req.body, {where: {id: id}});
    res.json({message: "Vacancy closed"});
});


app.post("/newresponse", async (req, res) => {
    if (req.body.isWorker === 'true') {
        const newResponse = await WorkerVacancy.create({
            workerId: req.body.workerId,
            vacancyId: req.body.vacancyId,
        });
        res.json(newResponse);
    } else {
        res.status(403).json({message: "не работник"});
    }
})

app.get("/responses", async (req, res) => {
    const vacancy = await WorkerVacancy.findOne({
        where:
            {
                vacancyId: req.query.vacancyId,
                workerId: req.query.workerId
            }
    });
    res.json(vacancy);
});

app.get("/myresponses", async (req, res) => {
    try {
        if (req.query.isWorker === "true") {
            const responses = await WorkerVacancy.findAll({
                where: {workerId: req.query.workerId},
                include: Vacancy,
            });

            const respondedVacancies = responses ? responses.map(response => response.Vacancy) : [];
            res.json(respondedVacancies);
        } else {
            res.status(403).json({message: "не работник"});
        }
    } catch (error) {
        console.error("Ошибка при получении вакансий на которые откликался пользователь.", error);
        res.status(500).json({message: "Ошибка сервера"});
    }
});

app.get('/responses-count/:vacancyId', async (req, res) => {
    try {
        const vacancyId = req.params.vacancyId;

        const responseCount = await WorkerVacancy.count({
            where: {vacancyId: vacancyId},
        });

        res.json({responseCount});
    } catch (error) {
        console.error('Error retrieving response count:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


app.delete("/vacancies/:id", async (req, res) => {
    if (req.query.isWorker === "true") {
        const vacancyId = req.params.id;
        await WorkerVacancy.destroy({
            where:
                {
                    workerId: req.query.workerId,
                    vacancyId: vacancyId,
                }
        });
        res.status(200).json({message: "отклик удалён"});
    } else {
        res.status(403).json({message: "не работник"});
    }
})


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
})
