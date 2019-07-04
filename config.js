import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 4000

const mongo = {
    user: process.env.MONGO_USER || 'txs',
    password: process.env.MONGO_PASSWORD || 'txs123',
    url: process.env.MONGO_URL || '192.168.1.250',
    port: process.env.MONGO_URL || '27017',
    db: process.env.MONGO_DB || 'full-txs?authSource=txs'
}

const btc = {
    url: 'http://192.168.1.250:18332',
    username: 'silotech',
    password: 'abc123'
}


export  {
    mongo,
    btc
}