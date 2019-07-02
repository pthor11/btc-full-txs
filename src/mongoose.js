import mongoose from 'mongoose'
import {mongo} from '../config'

mongoose.Promise = global.Promise

const uri = `mongodb://${mongo.user}:${mongo.password}@${mongo.url}:${27017}/${mongo.db}`



const opts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.conn = mongoose.createConnection(uri, opts)

export default mongoose