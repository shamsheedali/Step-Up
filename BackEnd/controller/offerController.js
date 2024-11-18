import Offer from "../modal/offerModal.js";

//CREATING OFFER
const createOffer = async (req, res) => {
  const {
    title,
    description,
    associatedFor,
    offerPrice,
    productsIncluded,
    categoryIncluded,
    endDate,
    isActive,
  } = req.body;

  
  try {
    const offer = new Offer({
      title,
      description,
      associatedFor,
      offerPrice,
      productsIncluded,
      categoryIncluded,
      endDate,
      isActive,
    });
    console.log(offer);

    await offer.save();
    res.status(201).json({ message: "Offer created", offer });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating offer", error });
  }
};

//EDIT OFFER 
const editOffer = async(req, res) => {
  const offerId = req.params.id;
  try {
    const offer = await Offer.findById({_id : offerId});
    
    if(!offer) return res.status(404).json({message: "offer not found!"});

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, req.body, {new: true});

    console.log(updatedOffer);
    return res.status(200).json({updatedOffer});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : "Error while Updating offer!"});
  }
}

//DELETE OFFER
const deleteOffer = async(req, res) => {
  const offerId = req.params.id;
  try {
    await Offer.findByIdAndDelete({_id: offerId})

    res.status(200).json({message: "Offer Deleted"})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error While Deleting Offer!", error});
  }
}

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

      if (!activeOffer || activeOffer.endDate < new Date()) {
          return res.status(404).json({ message: "No active offer available" });
      }

      res.status(200).json({ activeOffer });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
  }
};

export {createOffer, editOffer, getOffers, deleteOffer, getActiveOffer};