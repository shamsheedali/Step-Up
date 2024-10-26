import Bag from "../modal/bagModal.js";
import Product from "../modal/productModal.js";

//ADDING ITEMS TO BAG
const addToBag = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    //finding bag of user
    let bag = await Bag.findOne({ userId });
    console.log("bag", bag)

    if (!bag) {
      bag = new Bag({ userId, products: [] });
    }

    //checking if the product is already in bag or not
    const existingProductIndex = bag.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Product is already in the bag, so increment the quantity
      bag.products[existingProductIndex].quantity += 1;
    } else {
      bag.products.push({
        productId: product._id,
        productName: product.productName,
        quantity: 1,
      });
    }

    // Save the bag
    await bag.save();

    res.status(200).json({ message: "Product added to bag", bag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to bag" });
  }
};

//FETCHING BAG
const fetchBag = async (req, res) => {
  try {
    const userId = req.params.id;

    const bag = await Bag.findOne({ userId }).populate(
      "products.productId",
      "productName category price images"
    );

    if (!bag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    const bagDetails = bag.products.map((item) => ({
      productId: item.productId._id,
      productImage: item.productId.images[0],
      productName: item.productId.productName,
      category: item.productId.category,
      price: item.productId.price,
      quantity: item.quantity,
      subtotal: item.productId.price * item.quantity,
    }));

    // Calculate the total bag value
    const totalAmount = bagDetails.reduce(
      (total, item) => total + item.subtotal,
      0
    );
    res.status(200).json({ bagItems: bagDetails, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bag" });
  }
};

//DELETING PRODUCT FORM BAG
const deleteProductFromBag = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Use $pull to remove the product directly from the array in MongoDB
    const bag = await Bag.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId: productId } } },
      { new: true }
    );

    if (!bag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    const updatedBag = await Bag.findOne({ userId }).populate(
      "products.productId",
      "productName category price images"
    );

    const bagDetails = updatedBag.products.map((item) => ({
      productId: item.productId._id,
      productImage: item.productId.images[0],
      productName: item.productId.productName,
      category: item.productId.category,
      price: item.productId.price,
      quantity: item.quantity,
      subtotal: item.productId.price * item.quantity,
    }));

    const totalAmount = bagDetails.reduce(
      (total, item) => total + item.subtotal,
      0
    );
    res.status(200).json({ bagItems: bagDetails, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { addToBag, fetchBag, deleteProductFromBag };
