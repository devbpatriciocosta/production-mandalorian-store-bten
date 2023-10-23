import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref:'productsCategory',
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    isAvailable: {
        type:Boolean
    },
    shipping: {
        type: Boolean
    },
    rating: {
        type: Number,
        required: false,
    },
    slug: {
        type:String,
        lowercase: true,
    }
}, { timestamps:true });

export default mongoose.model('productsDetails', productsSchema);