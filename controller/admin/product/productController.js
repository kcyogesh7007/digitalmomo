const Product = require("../../../model/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filepath;
  if (!file) {
    filepath =
      "https://imgs.search.brave.com/TtYmA3686jR944FXRloVVekWG2G0A8tyYa2s_Q9jwuk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzUv/MDM4LzI2Mi9zbWFs/bC93aGl0ZS1taWxr/LWNhcnRvbi1wcm9k/dWN0LW1vY2t1cC1v/bi1wYXN0ZWwtcGlu/ay1iYWNrZ3JvdW5k/LW1pbmltYWxpc3Qt/c3R1ZGlvLXByb2R1/Y3Qtc2hvdC1mcmVl/LXBob3RvLmpwZw";
  } else {
    filepath = req.file.filename;
  }
  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStockQty,productStatus and productPrice",
    });
  }
  const product = await Product.create({
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
    productImage: filepath,
  });
  res.status(201).json({
    message: "Product created successfully",
    data: product,
  });
};

//get all products

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No products found",
      products: [],
    });
  } else {
    res.status(200).json({
      message: "Produts fetched successfully",
      products,
    });
  }
};

//get single product
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({
      message: "No product found with that id",
    });
  }
  res.status(200).json({
    message: "Product fetch successfully",
    product,
  });
};

//delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "please provide id",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that id",
    });
  }
  const oldProductImage = oldData.productImage;

  fs.unlink("./uploads/" + oldProductImage, (err) => {
    if (err) {
      console.log("error deleting file", err);
    } else {
      console.log("file deleted successfully");
    }
  });

  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product delete successfully",
  });
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;

  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice ||
    !id
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,id,productStockQty,productStatus and productPrice",
    });
  }

  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that id",
    });
  }
  const oldProductImage = oldData.productImage;

  if (req.file && req.file.filename) {
    fs.unlink("./uploads/" + oldProductImage, (err) => {
      if (err) {
        console.log("error deleting file", err);
      } else {
        console.log("file deleted successfully");
      }
    });
  }
  const data = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productStatus,
      productStockQty,
      productPrice,
      productImage:
        req.file && req.file.filename ? req.file.filename : oldProductImage,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "product updated successfully",
    data,
  });
};
