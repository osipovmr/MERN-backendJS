// библиотека шифрования
import bcrypt from 'bcrypt';

// для создания токена
import jwt from 'jsonwebtoken';
// импорт модели пользователя
import UserModel from '../models/User.js';

// регистрация, получаем данные запроса
export const register = async(req, res) => {
    try {
    // получаем пароль
    const password = req.body.password;
    // создаем соль для шифра
    const salt = await bcrypt.genSalt(10);
    // переменная с зашифрованным паролем
    const hash = await bcrypt.hash(password, salt);
    // документ с данными о пользователе в БД
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    // создаем пользователя из сохраненного документа
    const user = await doc.save();
    
    // создаем токен, шифруем данные, срок действия токена не указываем
    const token = jwt.sign(
      {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      }, 
       'secret123',
    );

    const { passwordHash, ...userData} = user._doc;

    // ответ зарегистрированному пользователю
    res.json({...userData, token});
    console.log(token);
  }
    catch (err){
      console.log(err);
      res.status(500).json({
          message: 'Не удалось зарегистрироваться',
      })  }
  };

// авторизация пользователя
export const login = async(req, res) => {
    try {
    // ищем пользователя по почте
    const user = await UserModel.findOne({email: req.body.email});
    if (!user) {
    return res.status(404).json({
        message: 'Пользователь не найден',
    });
    }
    // булеан проверки введенного пароля и существующего
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPassword) {
        return res.status(400).json({
            message: 'Неверный логин или пароль',
        })
    }
    // создаем токен
    const token = jwt.sign(
        // помещаем шифруемую информацию
        {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        }, 
          // указываем код шифрования
         'secret123',
      );
      const { passwordHash, ...userData} = user._doc;
      // ответ авторизованному пользователю
      res.json({
        ...userData,
        token});
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться.',
        }) 
    }};

// проверка авторизации
export const getMe = async(req, res) => {
    try {
        // через расшифрованный токен находим пользоваетля из БД
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
    const { passwordHash, ...userData} = user._doc;
    res.json(userData);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа.',
        });
    }};