import Wallet from "../modal/walletModal.js";
import HttpStatus from "../utils/httpStatus.js";

const getUserWalletDetails = async (req, res) => {
    const uid = req.params.userId;
    try {
      const limit = parseInt(req.query.limit) || 5;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
  
      const wallet = await Wallet.findOne({ userId: uid });
  
      if (!wallet) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "Wallet not found!" });
      }
  
      const paginatedTransactions = wallet.transactions.slice(skip, skip + limit);
  
      const totalBalance = wallet.transactions.reduce((acc, transaction) => {
        if (transaction.type === "Credit") {
          return acc + transaction.amount; 
        } else if (transaction.type === "Debit") {
          return acc - transaction.amount; 
        }
        return acc;
      }, 0);

      const totalTransactions = wallet.transactions.length;
  
      res.status(HttpStatus.OK).json({
        walletDetails: [
          {
            _id: wallet._id,
            userId: wallet.userId,
            transactions: paginatedTransactions, 
            totalBalance, 
            totalTransactions, 
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt,
          },
        ],
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching wallet!" });
    }
  };
  

export { getUserWalletDetails };
