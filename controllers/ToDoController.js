import ToDoModel from '../models/ToDo.js';

// создание записи
export const create = async(req, res) => {
    try {
        // создаем документ записи, данные берем из запроса
        const doc = new ToDoModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
        // сохраняем данные
        const toDo = await doc.save();
        // в ответ выдаем данные записи
        res.json(toDo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
        message: 'Не удалось создать запись',
        })  
    }
}

// получение всех статей
export const getAll = async(req, res) => {
    try {
        // поиск записей с указанием автора
        const toDo = await ToDoModel.find().populate('user').exec();
        res.json(toDo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить записи.',
            })  
    }
}

// получение одной записи
export const getOne = async(req, res) => {
    try {
        // получаем id записи из запроса
        const toDoId = req.params.id;
        // поиск записи
        ToDoModel.findOne(
            {
                _id: toDoId,
            },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось получить запись.',
                            });
                    }
                    if (!doc) {
                        res.status(404).json({
                        message: 'Запись не найдена.',
                        });
                    }
                    res.json(doc);
                },
        ).populate('user');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить запись.',
            })
    }
}

// удаление записи
export const remove = async(req, res) => {
    try {
        const toDoId = req.params.id;
        PostModel.findOneAndDelete(
            {
                _id: toDoId,
            },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось удалить запись.',
                            });
                    }
                    if (!doc) {
                        res.status(404).json({
                        message: 'Запись не найдена.',
                        });
                    }
                    res.json({
                        success: 'true',
                        });
                },
        );          
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить запись.',
            })
    }
}

// редактирование записи
export const update = async(req, res) => {
    try {
        const toDoId = req.params.id;
        await ToDoModel.findByIdAndUpdate(
            {
                _id: toDoId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            },
        );
        res.json({
            success: 'true',
        });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить запись',
        });  
    }
}
