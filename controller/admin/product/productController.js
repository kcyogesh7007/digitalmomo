const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
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
  });
  res.status(201).json({
    message: "Product created successfully",
    data: product,
  });
};
