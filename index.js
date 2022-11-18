import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import {loginValidator, postCreateValidator, registerValidator} from './validations.js';
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

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer( {storage});



app.use('/uploads', express.static('uploads'));

// стартовая страница приветствия
app.get('/', (req, res) => {
    res.send('Добро пожаловать! Приложение написано Осиповым Ильей, телеграм @osipov_mr.');
})

// авторизация пользователя
app.post('/login', loginValidator, handleValidationsErrors, UserController.login);

// регистрация пользователя
app.post('/register', registerValidator, handleValidationsErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, handleValidationsErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationsErrors, PostController.update);


// прописываем порт приложения
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});

