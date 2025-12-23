const {
  createProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");

const { multer, storage } = require("../middleware/multerConfig");
const upload = multer({ storage });

const router = require("express").Router();

router
  .route("/product")
  .post(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    createProduct
  );

module.exports = router;
