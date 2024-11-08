import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/offer";

const getAllOffers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-offers`);

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createOffer = async(offerData) => {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await axios.post(`${API_URL}/create`, offerData, {
            headers: {
                Authorization: `Bearer, ${token}`
            }
        });

        console.log(response);
        if(response.status === 201){
            toast.success("New Offer Created");
        }
    } catch (error) {
        console.log(error);
    }
};

//GET ACTIVE OFFER (USER);
const getActiveOffer = async() => {
  try {
    const response = await axios.get(`${API_URL}/get-activeOffer`);

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

export { getAllOffers, createOffer, getActiveOffer };
