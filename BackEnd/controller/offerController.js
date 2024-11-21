import Offer from "../modal/offerModal.js";
import HttpStatus from '../utils/httpStatus.js';

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
    if(req.body.isActive) await Offer.updateMany({isActive: false});
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
    await offer.save();
    res.status(HttpStatus.CREATED).json({ message: "Offer created", offer });
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating offer", error });
  }
};

//EDIT OFFER 
const editOffer = async(req, res) => {
  const offerId = req.params.id;
  try {
    if(req.body.isActive) await Offer.updateMany({isActive: false});
    
    const offer = await Offer.findById({_id : offerId});
    
    if(!offer) return res.status(HttpStatus.NOT_FOUND).json({message: "offer not found!"});

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, req.body, {new: true});

    return res.status(HttpStatus.OK).json({updatedOffer});
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : "Error while Updating offer!"});
  }
}

//DELETE OFFER
const deleteOffer = async(req, res) => {
  const offerId = req.params.id;
  try {
    await Offer.findByIdAndDelete({_id: offerId})

    res.status(HttpStatus.OK).json({message: "Offer Deleted"})
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Error While Deleting Offer!", error});
  }
}

//GET ALL OFFERS (ADMIN)
const getOffers = async (req, res) => {
    try {
        const allOffers = await Offer.find();

        res.status(HttpStatus.OK).json({allOffers});
    } catch (error) {
        console.log(error);
    }
}

// GET ACTIVE OFFER (USER)
const getActiveOffer = async (req, res) => {
  try {
      const activeOffer = await Offer.findOne({ isActive: true });

      if (!activeOffer || activeOffer.endDate < new Date()) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "No active offer available" });
      }

      res.status(HttpStatus.OK).json({ activeOffer });
  } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

export {createOffer, editOffer, getOffers, deleteOffer, getActiveOffer};