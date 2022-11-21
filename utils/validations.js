import {body} from 'express-validator';

// проверка данных при авторизаии
export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов!').isLength({min: 5}),
]

// проверка данных при регистрации
export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов!').isLength({min: 5}),
    body('fullName', 'Минимум 3 символа!').isLength({min: 3}),
    body('avatarUrl', 'Не верная ссылка на аватарку').optional().isURL(),
]

// проверка данных при создании записи
export const toDoCreateValidator = [
    body('title', 'Введите заголовок записи').isLength({min: 3}).isString(),
    body('text', 'Введите текст записи').isLength({min: 10}).isString(),
    body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),
]