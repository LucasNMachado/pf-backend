import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'Products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

productSchema.plugin(mongoosePaginate);
const productsModel= mongoose.model(productsCollection, productSchema);

export default productsModel;