import rpc from './rpc'
import Checkpoint from './models/Checkpoint'
import TX from './models/TX.full'

let checkpoint = null

const trace = async () => {
    try {

        checkpoint = checkpoint || (await Checkpoint.findOne({ mission: 'fulltx' }) || new Checkpoint({ mission: 'fulltx', at: 0 }))

        await checkpoint.save()

        const blockHeight = checkpoint.at === 0 ? 0 : checkpoint.at + 1

        const blockhash_response = await rpc('getblockhash', [blockHeight])
        const blockhash = blockhash_response.data.result

        const block_response = await rpc('getblock', [blockhash])
        const block = block_response.data.result

        if (!block) {
            console.log(`A L L  D O N E`)
            process.exit(0)
        }

        for (const txid of block.tx) {
            let rawtx_response = null

            try {
                rawtx_response = await rpc('getrawtransaction', [txid])
            } catch (err) {                
                if (err.response.data.error.message === 'The genesis block coinbase is not considered an ordinary transaction and cannot be retrieved') {          
                    continue
                } else {
                    console.log(err.response)
                    process.exit(0)
                }
            }

            const rawtx = rawtx_response.data.result
            const decodetx_response = await rpc('decoderawtransaction', [rawtx])
            const decodetx = decodetx_response.data.result

            const tx = {
                ...decodetx,
                time: block.time,
                height: block.height
            }

            await TX.findOneAndUpdate({ txid: tx.txid }, tx, { upsert: true, setDefaultsOnInsert: true })

            
        }
        checkpoint.at += 1

        trace()
    } catch (err) {
        console.log(err)
    }

}

const start = async () => {
    const blockcount_response = await rpc('getblockcount', [])
    const blockcount = blockcount_response.data.result
    console.log(blockcount)

    trace()

    setInterval(() => {
        console.log(`> passed: ${(checkpoint.at * 100 / blockcount).toFixed(4)} %`)

    }, 2000)

}

start()