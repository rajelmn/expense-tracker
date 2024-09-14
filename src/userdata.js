import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    name: String,
    password: String,
    sessionID: String,
    date: String,
    qty: Number,
    designiation: String,
    uniquePrice: Number,
    imputation: String,
    price: Number,
    numero: String,
    id: String,
})

const UserModel = new mongoose.model('ghassem', UserSchema);
const Expenses = new mongoose.model('expenses', UserSchema)
export {UserModel, Expenses}

// date: '2024-09-10',
// name: 'test',
// qty: '2',
// uniquePrice: '30303',
// imputation: 'AF1',
// price: 60606,
// id: '1e6416a2-bcd6-4fc1-884d-441f96da12ed'