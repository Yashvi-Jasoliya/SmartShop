import { useParams } from 'react-router-dom';
import OrderDetails from '../components/OrderDetails';
import Footer from '../components/Footer';

const OrderDetailsPage = () => {
    const params = useParams();

    return (
        <div>
            <OrderDetails orderId={params.id!} />
         
        </div>
    );
};

export default OrderDetailsPage;
