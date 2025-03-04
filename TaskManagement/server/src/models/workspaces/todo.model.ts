import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    isTick: {
        type: Boolean, 
        default: false,
    },
    title: {
        type: String,
        required: true,
    }
})

export const TodoModel = mongoose.model("Todo", todoSchema)
