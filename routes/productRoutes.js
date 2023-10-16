const express = require("express");
const router = express();

// const productControllers = require("../controller/productController");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { isAuth } = require("../middleware/isAuth");
const { upload_multiple_file } = require("../controller/uploadImageController");
const upload = require("../config/multer.config");
/**
 * @swagger
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: Use Bearer token to authenticate.
 */
/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Get a list of all products.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of products.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     description: Create a new product.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully created a new product.
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  isAuth,
  upload.array("image"),
  upload_multiple_file,
  createProduct
);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     description: Get a product by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     tags:
 *       - Products
 *     description: Update a product by ID.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     tags:
 *       - Products
 *     description: Delete a product by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: The ID of the product to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully deleted the product.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router
  .route("/:id")
  .get(getAProduct)
  .put(isAuth, updateProduct)
  .delete(isAuth, deleteProduct);

module.exports = router;
