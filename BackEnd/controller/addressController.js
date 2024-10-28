import address from "../modal/addressModal.js";

//ADD NEW ADDRESS
const addAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const newAddress = new address({
      ...req.body,  
      userId: userId 
    });
    if(req.body.defaultAddress === true){
      await address.updateMany({ userId }, { $set: { defaultAddress: false } });
    }
    await newAddress.save();
    res.status(201).json({ message: "New Address Added", newAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//FETCH ADDRESS
const fetchAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    const allAddress = await address.find({userId});
    res.status(200).json({ allAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//EDIT ADDRESS
const editAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAddress = await address.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAddress) {
      return res.status(400).json({ message: "No Address Found!" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteAddress = await address.findByIdAndDelete(id);
        if(!deleteAddress) {
            return res.status(400).json({message: "No Address Found!"});
        }
        res.status(200).json({message: "Address Successfully Deleted!"});
    } catch (error) {
        console.log(error);
    }
};

//fetch only default address
const getDefault = async (req, res) => {
  try {
    const userId = req.params.id;
    const defaultAddress = await address.find({userId, defaultAddress : true});
    res.status(200).json({defaultAddress})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"})
  }
}

export { addAddress, fetchAddress, editAddress, deleteAddress, getDefault };
