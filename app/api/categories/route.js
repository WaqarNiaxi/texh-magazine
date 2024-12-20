import { connectDB } from "@/lib/connection";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { authenticate } from "@/middleware/auth";

/** GET: Retrieve categories with total items */
export async function GET(req) {
  await connectDB();

  // const auth = await authenticate(req);
  // if (!auth.authenticated) {
  //   return new Response(JSON.stringify({ message: auth.message }), { status: 401 });
  // }

  try {
    const categories = await Category.find();

    // Add totalItems by counting related products
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const totalItems = await Product.countDocuments({ category: category._id });
        return { ...category.toObject(), totalItems };
      })
    );

    return new Response(
      JSON.stringify({ message: "Categories retrieved.", categories: categoriesWithCounts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch categories.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** POST: Create a new category */
export async function POST(req) {
  await connectDB();

  const auth = await authenticate(req);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ message: auth.message }), { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ message: "Category name is required." }),
        { status: 400 }
      );
    }

    const newCategory = await Category.create({ name });

    return new Response(
      JSON.stringify({ message: "Category created.", category: newCategory }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to create category.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** PUT: Update a category */
export async function PUT(req) {
  await connectDB();

  const auth = await authenticate(req);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ message: auth.message }), { status: 401 });
  }

  try {
    const { _id, name } = await req.json();

    if (!_id || !name) {
      return new Response(
        JSON.stringify({ message: "Category ID and name are required." }),
        { status: 400 }
      );
    }

    const category = await Category.findById(_id);
    if (!category) {
      return new Response(JSON.stringify({ message: "Category not found." }), { status: 404 });
    }

    category.name = name;
    await category.save();

    return new Response(
      JSON.stringify({ message: "Category updated.", category }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to update category.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** DELETE: Delete a category */
export async function DELETE(req) {
  await connectDB();

  const auth = await authenticate(req);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ message: auth.message }), { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Category ID is required." }),
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return new Response(JSON.stringify({ message: "Category not found." }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Category deleted." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to delete category.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
