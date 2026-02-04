import config from './payload.config.js'
import { getPayload } from 'payload'

console.log('Starting admin-fullblown test...')

const payload = await getPayload({ config })
console.log('Payload initialized')

await payload.find({
  collection: 'posts',
  limit: 1,
  depth: 2,
})
console.log('done')
