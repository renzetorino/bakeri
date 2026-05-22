import { db } from '@/lib/db';
import { products, productcategory } from '@/lib/db/schema/products-schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .leftJoin(productcategory, eq(products.productid, productcategory.productid));

  const grouped = Object.values(
    rows.reduce((acc, row) => {
      const p = row.products;
      const v = row.productcategory;

      if (!acc[p.productid]) {
        acc[p.productid] = {
          id: p.productid,
          name: p.productname,
          description: p.description,
          imageUrl: p.imageUrl,
          variants: [],
        };
      }

      if (v) {
        acc[p.productid].variants.push({
          id: v.productcategoryid,
          size: v.agesize, 
          color: v.color,
          price: Number(v.price),
          stock: v.currentstock,
          productcategoryid: v.productcategoryid,
        });
      }

      return acc;
    }, {} as any)
  );

  return Response.json(grouped);
}