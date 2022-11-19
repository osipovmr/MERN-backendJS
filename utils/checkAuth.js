import jwt from 'jsonwebtoken';
export default (req, res, next) => {
    //удаление Beaer из токена, если токен получен
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if (token) {
        try {
            // расшифровка токена
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } catch(e) {
            return res.status(403).json({
                message: 'Нет доступа',
        });
    }
} else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    } 
};