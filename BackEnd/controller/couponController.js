import Coupon from "../modal/couponModal.js";

const createCoupon = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      code,
      discountType,
      discountValue,
      minimumPurchase,
      maxDiscount,
      expiryDate,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    // Create the coupon
    const newCoupon = new Coupon({
      name,
      code,
      discountType,
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      maxDiscount,
      expiryDate: new Date(expiryDate),
      isActive: true,
    });

    // Save the coupon to the database
    await newCoupon.save();

    res.status(201).json({
      message: "Coupon created successfully!",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Server error while creating coupon." });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({coupons})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error Fetching Coupons!"});
  }
}

//verify coupon code
const verifyCouponCode = async(req, res) => {
  const {code, uid} = req.body;
  try {
    const coupon = await Coupon.findOne({code});

    if (!coupon) {
      return res.status(404).json({ message: "Coupon code not found." });
    }

    const currentDate = new Date();
    if (coupon.expiryDate && coupon.expiryDate < currentDate) {
      return res.status(400).json({ message: "Coupon code has expired." });
    }

    if (!coupon.status) {
      return res.status(400).json({ message: "Coupon code is not valid." });
    }

    // Check if the user ID is already in the usedBy array
    const isUsedByUser = coupon.usedBy.some(
      (userId) => userId.toString() === uid
    );

    if (isUsedByUser) {
      return res.status(400).json({ message: "You Already Userd This Coupon." });
    }

    res.status(200).json({
      message: "Coupon code is valid.",
      coupon
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

const deleteCoupon = async (req, res) => {
  const {id} = req.params
  try {
    await Coupon.findByIdAndDelete({_id: id,});

    res.status(200).json({message: "Coupon Deleted!!"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Error!!", error})
  }
}

export { createCoupon, getCoupons, verifyCouponCode, deleteCoupon };
