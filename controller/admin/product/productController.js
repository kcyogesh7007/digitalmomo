const Product = require("../../../model/productModel");

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
