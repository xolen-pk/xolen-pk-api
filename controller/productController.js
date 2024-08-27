import { APIfeatures } from "./paginate.js";
import productModel from "../models/productModel.js";

// Provides all the products based on the query parameters
export const getproductPage = async (req, res) => {
  try {
    const parsedPage = parseInt(req.query.page, 12);
    const parsedLimit = parseInt(req.query.limit, 12);
    req.query.page = isNaN(parsedPage) ? req.query.page : parsedPage.toString();
    req.query.limit = isNaN(parsedLimit) ? req.query.limit : parsedLimit.toString();
    const features = new APIfeatures(productModel.find(), req.query)
      .sorting()
      .paginating()
      .filtering();
    const data = await features.query;
    const paginateRemaining = features.paginate;
    const skip = paginateRemaining.skip ?? 0;
    const limit = paginateRemaining.limit ?? 12;
    const running = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Running" })
      .skip(skip)
      .limit(limit);
    const lounging = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Lounging" })
      .skip(skip)
      .limit(limit);
    const everyday = await productModel
      .find(features.queryString)
      .find({ shoeFor: "Everyday" })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ data, running, lounging, everyday });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};

// Provides top products based on the number of products sold
export const getTopProducts = async (req, res) => {
  try {
    const data = await productModel.find({}).sort({ sold: -1 }).limit(15);
    res.json({ data });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Add a new product to the database
export const createProductPage = async (req, res) => {
  const {
    title,
    description,
    selectedFile,
    price,
    category,
    size,
    quantity,
    shoeFor,
    brand,
    discountedPrice
  } = req.body;
  try {
    if (!title || !description) {
      // console.log('=== validating data ===');
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    if (!selectedFile) {
      return res.status(400).json({
        message: "Please provide a file",
      });
    }
    if (!price) {
      return res.status(400).json({
        message: "Please provide a price",
      });
    }
    if (!category) {
      return res.status(400).json({
        message: "Please provide a category",
      });
    }
    if (!size) {
      return res.status(400).json({
        message: "Please provide a size",
      });
    }
    if (!quantity) {
      return res.status(400).json({
        message: "Please provide a quantity",
      });
    }
    if (!shoeFor) {
      return res.status(400).json({
        message: "Please provide a shoeFor",
      });
    }
    if (!brand) {
      return res.status(400).json({
        message: "Please provide a brand",
      });
    }
    const productPageData = new productModel({
      title,
      description,
      selectedFile,
      price,
      category,
      size,
      quantity,
      shoeFor,
      brand,
      discountedPrice
    });


    
    // console.log('=== saving data ===');
    // console.log(productPageData);
    const savedproductPage = await productPageData.save();
    res.status(200).json({
      data: savedproductPage,
      message: `${savedproductPage.title} created successfully`,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// Updates the product details based on the product id
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const {
    title,
    description,
    selectedFile,
    price,
    category,
    size,
    quantity,
    shoeFor,
    brand,
    discountedPrice, 
  } = req.body;
  try {
    // console.log(req.params);
    if (!title || !description) {
      // console.log("=== validating data ===");
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    if (!selectedFile) {
      return res.status(400).json({
        message: "Please provide a file",
      });
    }
    if (!price) {
      return res.status(400).json({
        message: "Please provide a price",
      });
    }
    if (!category) {
      return res.status(400).json({
        message: "Please provide a category",
      });
    }
    if (!size) {
      return res.status(400).json({
        message: "Please provide a size",
      });
    }
    if (!quantity) {
      return res.status(400).json({
        message: "Please provide a quantity",
      });
    }
    if (!shoeFor) {
      return res.status(400).json({
        message: "Please provide a shoeFor",
      });
    }
    if (!brand) {
      return res.status(400).json({
        message: "Please provide a brand",
      });
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        selectedFile,
        price,
        category,
        size,
        quantity,
        shoeFor,
        brand,
        discountedPrice, 
      },
      { new: true }
    );
    res.status(200).json({
      data: updatedProduct,
      message: `${updatedProduct?.title} updated successfully`,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Provides the product details based on the product id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const ProductById = await productModel.findById(id);
    if (ProductById) {
      const title = ProductById.title;
      res.json({ data: ProductById, message: "Product " + title });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// Filters the products based on brand and category
export const getfilterProduct = async (req, res) => {
  try {
    const data = await productModel.find({}).select("brand category");
    const pages = await productModel.find().countDocuments();
    const limit = 12;
    const totalPages = Math.ceil(pages / limit);
    const pageArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }
    const brand = data.map((item) => item.brand);
    const category = data.map((item) => item.category).flat();
    const allBrand = brand.filter((item) => item !== undefined && item !== null);
    const allCategory = category.filter((item) => item !== undefined && item !== null);
    const brandCapatalize = allBrand.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
    const categoryCapatalize = allCategory.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
    const uniqueBrand = [...new Set(brandCapatalize)];
    const uniqueCategory = [...new Set(categoryCapatalize)];
    res.json({
      data: {
        brand: uniqueBrand,
        category: uniqueCategory,
        pageNumbers: pageArray,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Deletes the product based on the product id
export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await productModel.findByIdAndRemove(id);
    res.status(200).json({
      data: deletedProduct,
      message: `${deletedProduct.title} deleted successfully`,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
    // console.log(error);
  }
}

// Provides the product details based on the title
export const getProductByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const ProductByTitle = await productModel.find({ title: title });
    if (ProductByTitle) {
      res.json({ data: ProductByTitle, message: "Product " + title });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
