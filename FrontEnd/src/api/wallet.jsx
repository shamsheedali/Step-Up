import axios from 'axios';

const API_URL = "http://localhost:3000/wallet";

const getUserWallet = async(userId) => {
    const token = localStorage.getItem('userToken');
    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer, ${token}`
            }
        })
        console.log(response);
        return response.data.walletDetails[0];
    } catch (error) {
        console.log(error);
    }
}

export {getUserWallet}