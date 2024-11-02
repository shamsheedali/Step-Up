import Wishlist from "../modal/wishlistModal.js";
import Product from "../modal/productModal.js";

//Adding Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    //finding wihslist of user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const existingProductIndex = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Product is already in the wishlist
      return res.status(400).json({ message: "Product already in wishlist!" });
    } else {
      wishlist.products.push({
        productId: product._id,
      });
    }

    await wishlist.save();

    res.status(200).json({ message: "Product added to Wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to wishlist" });
  }
};

//FETCHING WISHLIST
const fetchWishlist = async (req, res) => {
  try {
    const userId = req.params.id;

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products.productId",
      "productName category price stock images"
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const wishlistDetails = wishlist.products.map((item) => ({
      productId: item.productId._id,
      productImage: item.productId.images[0],
      productName: item.productId.productName,
      category: item.productId.category,
      price: item.productId.price,
      stock: item.productId.stock,
      quantity: item.quantity,
      subtotal: item.productId.price * item.quantity,
    }));

    res.status(200).json({ wishlistItems: wishlistDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bag" });
  }
};

//Remove Product From Wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product", error });
  }
};

export { addToWishlist, fetchWishlist, removeFromWishlist };
