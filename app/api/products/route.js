import { connectDB } from "@/lib/connection";
import Product from '@/models/Product';
import multer from 'multer';
import { default as nextConnect } from 'next-connect'; // Update import statement

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: './public/uploads', // Ensure this folder exists
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware to disable body parsing (required for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

// API handler
const handler = nextConnect() // Use nextConnect
  .use(upload.single('image')) // Multer middleware

  // Get all products
  .get(async (req, res) => {
    try {
      await connectDB();
      const products = await Product.find({}).populate('category');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  })

  // Create a new product
  .post(async (req, res) => {
    try {
      // Since multer disables bodyParser, we need to parse the body manually
      await connectDB();
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', async () => {
        const { name, detail, category } = JSON.parse(data);
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const newProduct = new Product({ name, image, detail, category });
        await newProduct.save();

        res.status(201).json(newProduct);
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  })

  // Update a product
  .put(async (req, res) => {
    try {
      // Since multer disables bodyParser, we need to parse the body manually
      await connectDB();
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', async () => {
        const { id, name, detail, category } = JSON.parse(data);
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!id) {
          return res.status(400).json({ error: 'Product ID is required for update' });
        }

        const updateData = { name, detail, category };
        if (image) updateData.image = image;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  })

  // Delete a product
  .delete(async (req, res) => {
    try {
      await connectDB();
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', async () => {
        const { id } = JSON.parse(data);

        if (!id) {
          return res.status(400).json({ error: 'Product ID is required for deletion' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

export default handler;
