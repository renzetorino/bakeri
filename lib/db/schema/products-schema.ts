import { pgTable, integer, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  productid: integer('productid').primaryKey(),
  productname: text('productname').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('createdat').defaultNow(),
  updatedAt: timestamp('updatedat').defaultNow(),
});

export const productcategory = pgTable('productcategory', {
  productcategoryid: integer('productcategoryid').primaryKey(),
  productid: integer('productid').references(() => products.productid),

  price: numeric('price'),
  cost: numeric('cost'),
  color: text('color'),
  agesize: text('agesize'), // your "size"
  currentstock: integer('currentstock'),
  reorderpoint: integer('reorderpoint'),

  updatedstock: timestamp('updatedstock'),
});