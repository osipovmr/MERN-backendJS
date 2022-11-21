import mongoose from "mongoose";

// создаем модель статьи
const ToDoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        
        // автор статьи
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

// отправляем в БД
export default mongoose.model('ToDo', ToDoSchema);