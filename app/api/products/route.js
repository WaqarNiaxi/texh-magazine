import { connectDB } from "@/lib/connection";
import Product from "@/models/Product";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import Category from "@/models/Category";

// Middleware to disable body parsing (required for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};



async function handleFileUpload(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(process.cwd(), "public", "uploads", `${Date.now()}-${file.name}`);
  await writeFile(filePath, buffer);
  return `/uploads/${path.basename(filePath)}`;
}

// Named exports for each HTTP method
export async function GET(req) {
  try {
    await connectDB();
    const category = req.nextUrl.searchParams.get('category'); 
    const productsQuery = category ? { category } : {};
    const products = await Product.find(productsQuery).populate("category");
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name");
    const detail = formData.get("detail");
    const category = formData.get("category");
    const file = formData.get("image");

    let image = "";
    if (file) {
      image = await handleFileUpload(file);
    }

    const newProduct = new Product({ name, image, detail, category });
    await newProduct.save();

    const products = await Product.find({}).populate("category");
    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    // Parse form data
    const formData = await req.formData();
    const id = formData.get("_id"); // _id field is used for update
    const name = formData.get("name");
    const detail = formData.get("detail");
    const category = formData.get("category");
    const file = formData.get("image");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required for update" }, { status: 400 });
    }

    let image = "";
    if (file) {
      image = await handleFileUpload(file);
    }

    const updateData = { name, detail, category };
    if (image) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const products = await Product.find({}).populate("category");
    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    // Parse the raw body as text and then parse the JSON data
    const data = await req.text(); // Using `req.text()` instead of `req.on()`
    const { ids } = JSON.parse(data); // Parse the string data into an object

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required for deletion" },
        { status: 400 }
      );
    }

    // Delete all products with the specified IDs
    const result = await Product.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No products found to delete" }, { status: 404 });
    }

    // Fetch remaining products and populate their categories
    const products = await Product.find({}).populate("category");
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json({ error: "Failed to delete products", details: error.message }, { status: 500 });
  }
}
