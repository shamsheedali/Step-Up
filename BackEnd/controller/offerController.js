import Offer from "../modal/offerModal.js";

const createOffer = async (req, res) => {
  const {
    title,
    description,
    discount,
    type,
    productsIncluded,
    categoryIncluded,
    startDate,
    endDate,
  } = req.body;

  console.log(req.body);

  try {
    if (type === "product" && !productsIncluded.length) {
      return res
        .status(400)
        .json({
          message: "Products are required for product-specific offers.",
        });
    }
    if (type === "category" && !categoryIncluded) {
      return res
        .status(400)
        .json({ message: "Category is required for category-wide offers." });
    }

    const offer = new Offer({
      title,
      description,
      discount,
      type,
      productsIncluded,
      categoryIncluded,
      startDate,
      endDate,
      isActive: true,
    });

    await offer.save();
    res.status(201).json({ message: "Offer created", offer });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating offer", error });
  }
};

//GET ALL OFFERS (ADMIN)
const getOffers = async (req, res) => {
    try {
        const allOffers = await Offer.find();

        res.status(200).json({allOffers});
    } catch (error) {
        console.log(error);
    }
}

// GET ACTIVE OFFER (USER)
const getActiveOffer = async (req, res) => {
  try {
      const activeOffer = await Offer.findOne({ isActive: true });

      if (!activeOffer) {
          return res.status(404).json({ message: "No active offer available" });
      }

      res.status(200).json({ activeOffer });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
  }
};


export {createOffer, getOffers, getActiveOffer};