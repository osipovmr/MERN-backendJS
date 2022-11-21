import express from 'express';
// библиотека для загрузки файлов
import multer from 'multer';
// БД
import mongoose from 'mongoose';
// разрешение на доступ из фронта
import cors from 'cors';

import {loginValidator, toDoCreateValidator, registerValidator} from './utils/validations.js';
import {checkAuth, handleValidationsErrors} from './utils/index.js';
import {UserController, ToDoController} from './controllers/index.js';


// подключаем экспресс
const app = express();
// учим приложение понимать формат JSON входящих запросов
app.use(express.json());
app.use(cors());
// подключаем БД, проверяем подключение
mongoose.connect('mongodb+srv://osipovmr:qqqqqq@cluster0.yzvyi9w.mongodb.net/?retryWrites=true&w=majority')
        .then(()=> console.log('DB ok'))
        .catch((err) => console.log('DB error', err));

// создаем хранилище файлов
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        // место хранения файлов
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        // имя файла
        cb(null, file.originalname);
    },
});

// константа для загрузки
const upload = multer( {storage} );

// стартовая страница приветствия
app.get('/', (req, res) => {
    res.send('Добро пожаловать! Приложение написано Осиповым Ильей, телеграм @osipov_mr.');
})

// регистрация пользователя
app.post('/register', registerValidator, handleValidationsErrors, UserController.register);

// авторизация пользователя
app.post('/login', loginValidator, handleValidationsErrors, UserController.login);

// получение информации о себе
app.get('/me', checkAuth, UserController.getMe);


// создание статьи
app.post('/todo', checkAuth, toDoCreateValidator, handleValidationsErrors, ToDoController.create);
// получение одной статьи
app.get('/todo/:id', ToDoController.getOne);
// получение всех статей
app.get('/todo', ToDoController.getAll);
// редактирование статьи
app.patch('/todo/:id', checkAuth, toDoCreateValidator, handleValidationsErrors, ToDoController.update);
// удаление статьи
app.delete('/todo/:id', checkAuth, ToDoController.remove);

// загрузка файлов
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// объясняем приложению, где искать запрошенные файлы
app.use('/uploads', express.static('uploads'));

// прописываем порт приложения
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});

