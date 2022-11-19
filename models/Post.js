import mongoose from "mongoose";

// создаем модель статьи
const PostSchema = new mongoose.Schema(
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
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        // автор статьи
        user: {
            type: mongoose.Schema.Types.ObjectId,
            reg: 'user',
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }

);

// отправляем в БД
export default mongoose.model('Post', PostSchema);