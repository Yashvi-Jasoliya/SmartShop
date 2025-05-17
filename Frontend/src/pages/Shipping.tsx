import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CartReducerInitialState } from '../types/reducer-types';
import axios from 'axios';
import { server } from '../redux/store';
import toast from 'react-hot-toast';
import { saveShippingInfo } from '../redux/reducer/cartReducer';

const Shipping = () => {
    const { cartItems, total } = useSelector(
        (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const token = useSelector((state: any) => state.userReducer?.user?.token);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phoneNo: '',
    });

    const [isLoadingShip, SetIsLoadingShip] = useState(false);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        try {
            SetIsLoadingShip(true);

            if (!token) {
                toast.error("No token found. Please log in.");
                return;
            }

            const { data } = await axios.post(
                `${server}/api/v1/payment/create`,
                { amount: total },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ Secure token
                    },
                }
            );

            navigate('/pay', {
                state: data.client_secret,
            });
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            SetIsLoadingShip(false);
        }
    };
}

export default Shipping;
