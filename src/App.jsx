import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';

import { useState } from 'react';


import ProductList from './component/ProductList';
import CartList from './component/CartList.jsx';
import OrderForm from './component/OrderForm.jsx';

import axios from 'axios';
import ScreenLoading from './component/ScreenLoading.jsx';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState({});
  // 取得購物車
  const getCart = async () => {
    setIsScreenLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      setCartData(response.data.data);
    } catch (error) {
      console.log(error);
      alert(`取得購物清單失敗`);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      <ScreenLoading isScreenLoading={isScreenLoading}/>
      <ProductList
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isScreenLoading={isScreenLoading}
        setIsScreenLoading={setIsScreenLoading}
        getCart={getCart}
      />
      <CartList
        setIsScreenLoading={setIsScreenLoading}
        getCart={getCart}
        cartData={cartData}
      />
      <OrderForm
        setIsScreenLoading={setIsScreenLoading}
        getCart={getCart}
        cartData={cartData}
      />
    </>
  );
}

export default App;
