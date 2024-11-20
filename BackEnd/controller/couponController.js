import Coupon from "../modal/couponModal.js";

const createCoupon = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      discountPercentage,
      minimumPurchase,
      maxDiscount,
      usageLimit,
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
      description,
      minimumPurchase: minimumPurchase || 0,
      discountPercentage,
      maxDiscount,
      expiryDate: new Date(expiryDate),
      usageLimit,
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
    res.status(200).json({ coupons });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Fetching Coupons!" });
  }
};

//get Coupons with limit (pagination/ Admin)
const getLimitCoupons = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalCoupons = await Coupon.countDocuments({});
    const coupons = await Coupon.find({}).skip(skip).limit(limit);

    res.status(200).json({ coupons, totalCoupons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Coupons", error });
  }
};

//edit coupon
const editCoupon = async (req, res) => {
  const couponId = req.params.id;
  const {
    couponName,
    couponCode,
    description,
    discountPercentage,
    minimumPurchase,
    maxDiscount,
    usageLimit,
    expiryDate,
  } = req.body;
  try {
    const data = {
      name: couponName,
      code: couponCode,
      description,
      discountPercentage,
      minimumPurchase,
      maxDiscount,
      expiryDate,
      usageLimit,
    };
    const coupon = await Coupon.findByIdAndUpdate(couponId, data, {
      new: true,
    });

    if (!coupon) return res.status(404).json({ message: "coupon not found!" });

    res.status(200).json({ coupon });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating coupon", error });
  }
};

//Change coupon status
const toggleCouponStatus = async (req, res) => {
  const couponId = req.params.id;
  try {
    const coupon = await Coupon.findById({ _id: couponId });

    if (!coupon) return res.status(404).json({ message: "coupon not found" });

    const newStatus = !coupon.status;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { status: newStatus },
      { new: true }
    );
    res.json({
      message: newStatus ? "Coupon Activated" : "Coupon Inactivated",
      updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//verify coupon code
const verifyCouponCode = async (req, res) => {
  const { code, uid } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });

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

    //checking for user used or not
    const isUsedByUser = coupon.usedBy.some(
      (userId) => userId.toString() === uid
    );

    if (isUsedByUser) {
      return res
        .status(400)
        .json({ message: "You Already Used This Coupon." });
    }

    res.status(200).json({
      message: "Coupon code is valid.",
      coupon,
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    await Coupon.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: "Coupon Deleted!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error!!", error });
  }
};

export {
  createCoupon,
  getCoupons,
  verifyCouponCode,
  editCoupon,
  toggleCouponStatus,
  deleteCoupon,
  getLimitCoupons,
};
