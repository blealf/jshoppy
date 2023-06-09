import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    },
    date_added: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('item',ItemSchema)