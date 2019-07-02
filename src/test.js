import rpc from './rpc'
import TX from './models/TX.full'

const testBlock = async () => {
    const height = 54507

    const blockhash_response = await rpc('getblockhash', [height])
    const blockhash = blockhash_response.data.result

    const block_response = await rpc('getblock', [blockhash])
    const block = block_response.data.result

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

        console.log(decodetx)
        
    }
}

// testBlock()

const testTX = async (txid) => {
    let rawtx_response = null

    try {
        rawtx_response = await rpc('getrawtransaction', [txid])
    } catch (err) {
        console.log(err.response)
    }

    const rawtx = rawtx_response.data.result
    const decodetx_response = await rpc('decoderawtransaction', [rawtx])
    const decodetx = decodetx_response.data.result

    console.log(decodetx.vout[0].scriptPubKey.addresses)
}

testTX('bd98d5a3ced0fae6436ddf84a4ca42fac114e3bde1cf0878974f5b604fdd4b5e')