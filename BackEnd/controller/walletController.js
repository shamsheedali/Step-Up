import Wallet from '../modal/walletModal.js';

const getUserWalletDetails = async(req, res) => {
    const uid = req.params.userId;

    try {
        const walletDetails = await Wallet.find({userId: uid});
        console.log(walletDetails);

        res.status(200).json({walletDetails})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error fetching wallet!"})
    }
}


export {getUserWalletDetails};