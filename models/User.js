import mongoose from "mongoose";

// создаем модель пользователя
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    }

);
// отправляем в БД
export default mongoose.model('user', UserSchema);