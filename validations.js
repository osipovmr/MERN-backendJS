import {body} from 'express-validator';

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов!').isLength({min: 5}),
]
export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов!').isLength({min: 5}),
    body('fullName', 'Минимум 3 символа!').isLength({min: 3}),
    body('avatarUrl', 'Не верная ссылка на аватарку').optional().isURL(),
]
export const postCreateValidator = [
    body('title', 'введите заголовок статьию').isLength({min: 3}).isString(),
    body('tetx', 'Введите текст статьию').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив).').optional().isString(),
    body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),
]