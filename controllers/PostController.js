import PostModel from '../models/Post.js';

// создание статьи
export const create = async(req, res) => {
    try {
        // создаем документ статьи, данные берем из запроса
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        // сохраняем данные
        const post = await doc.save();
        // в ответ выдаем данные статьи
        res.json(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
        message: 'Не удалось создать статью',
        })  
    }
}

// получение всех статей
export const getAll = async(req, res) => {
    try {
        // поиск статей с указанием автора
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи.',
            })  
    }
}

// получение одной статьи
export const getOne = async(req, res) => {
    try {
        // получаем id статьи из запроса
        const postId = req.params.id;
        // поиск статьи
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                // увеличение количества просмотров на 1
                $inc: {viewsCount: 1},
            },
            {
                // вернуть документ после обновления
                returnDocument: 'after',
            },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось получить статью.',
                            });
                    }
                    if (!doc) {
                        res.status(404).json({
                        message: 'Статья не найдена.',
                        });
                    }
                    res.json(doc);
                },
        ).populate('user');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью.',
            })
    }
}

// удаление статьи
export const remove = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Не удалось удалить статью.',
                            });
                    }
                    if (!doc) {
                        res.status(404).json({
                        message: 'Статья не найдена.',
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
            message: 'Не удалось получить статьи.',
            })
    }
}

// редактирование статьи
export const update = async(req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
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
            message: 'Не удалось обновить статью',
        });  
    }
}
