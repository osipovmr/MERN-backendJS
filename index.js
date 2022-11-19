import express from 'express';
// библиотека для загрузки файлов
import multer from 'multer';
// БД
import mongoose from 'mongoose';

import {loginValidator, postCreateValidator, registerValidator} from './utils/validations.js';
import {checkAuth, handleValidationsErrors} from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';


// подключаем экспресс
const app = express();
// учим приложение понимать формат JSON входящих запросов
app.use(express.json());
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
app.post('/posts', checkAuth, postCreateValidator, handleValidationsErrors, PostController.create);
// получение одной статьи
app.get('/posts/:id', PostController.getOne);
// получение всех статей
app.get('/posts', PostController.getAll);
// редактирование статьи
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationsErrors, PostController.update);
// удаление статьи
app.delete('/posts/:id', checkAuth, PostController.remove);

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

