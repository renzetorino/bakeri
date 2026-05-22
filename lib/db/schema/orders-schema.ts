import {
  pgTable,
  integer,
  text,
  numeric,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { userAccount } from './user-schema';
import { products, productcategory  } from './products-schema';



export const orderOnline = pgTable('OrderOnline', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  orderstatus: text('orderstatus'),
  totalprice: numeric('totalprice'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  boughtbyuserid: uuid('boughtbyuserid')
    .notNull()
    .references(() => userAccount.userid),
  orderdate: timestamp('orderdate'),
});


export const onlineOrderStatus = pgTable('OnlineOrderStatus', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  product: integer('product').references(() => products.productid),
  productcategoryid: integer('productcategoryid').references(
    () => productcategory.productcategoryid
  ),
  // Status of this particular item
  // (e.g. Pending, Preparing, Shipped, Delivered)
  OrderStatus: text('OrderStatus'),
  // Quantity ordered
  quantity: integer('quantity'),
  // Snapshot of product price at checkout
  unitprice: numeric('unitprice'),
  // quantity * unitprice
  subtotal: numeric('subtotal'),
  // Parent checkout order
  OrderOLid: integer('OrderOLid').references(() => orderOnline.id),
});