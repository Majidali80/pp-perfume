import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import review from './review'
import { order } from './order'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, review,order],
}
