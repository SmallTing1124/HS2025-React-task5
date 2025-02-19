import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';
import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  useEffect(() => {
    //取得商品資訊
    const getProducts = async () => {
      setIsScreenLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/${API_PATH}/products`
        );
        setProducts(response.data.products);
      } catch (error) {
        alert(`取得商品失敗`);
        console.dir(error.response.data.message);
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProducts();
  }, []);

  const [cartData, setCartData] = useState([]);
  // 取得購物車
  const getCart = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      setCartData(res.data.data);
    } catch (error) {
      console.log(error);
      alert(`取得購物清單失敗`);
    } finally {
      setIsScreenLoading(false);
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  // 查看商品詳情：Modal設定
  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current);
  }, []);
  const openProductInfoModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  const closeProductInfoModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  // 處理查看更多
  const [productInfo, setProductInfo] = useState(null);
  const [qtySelect, setQtySelect] = useState(1);
  const seeMore = (product) => {
    setProductInfo(product);
    openProductInfoModal();
  };

  // 事件處理：加入購物車
  const handleAddToCart = async (product_id, qty) => {
    setIsLoading(true)
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      closeProductInfoModal();
      setQtySelect(1);
      getCart();
    } catch (error) {
      console.log(error.response.message);
      alert(`加入購物車失敗`);
    }
    finally{
      setIsLoading(false)
    }
  };

  // 查看商品詳情：Modal設定
  const clearCartModalRef = useRef(null);
  useEffect(() => {
    new Modal(clearCartModalRef.current);
  }, []);
  const openClearCartModal = () => {
    const modalInstance = Modal.getInstance(clearCartModalRef.current);
    modalInstance.show();
  };
  const closeClearCartModal = () => {
    const modalInstance = Modal.getInstance(clearCartModalRef.current);
    modalInstance.hide();
  };

  const handleClearCart = () => {
    openClearCartModal();
  };
  const clearCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);
      closeClearCartModal();
      getCart();
    } catch (error) {
      console.log(error);
      alert(`清除購物車失敗！`);
    } finally {
      setIsScreenLoading(false);
    }
  };

  const handleRemoveItemCart = async (cart_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${cart_id}`);
      getCart();
    } catch (error) {
      console.log(error.response.data.message);
      alert(`刪除商品失敗`);
    } finally {
      setIsScreenLoading(false);
    }
  };

  const handleIncreaseProductQty = async (product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${product_id}`, {
        data: {
          product_id,
          qty,
        },
      });
      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const { message, ...user } = data;
    const orderInfo = {
      data: {
        user,
        message,
      },
    };
    createOrder(orderInfo);
  };

  const createOrder = async (orderInfo) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/order`, orderInfo);
      alert(`訂單送出成功！`);
      reset();
      getCart();
    } catch (error) {
      alert(`訂單失敗：${error.response?.data?.message || '發生未知錯誤'}`);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(45, 44, 44, 0.3)',
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
      {/* 商品列表 */}
      <div className="container">
        <div className="table-responsive mt-5">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id}>
                    <td style={{ width: '200px' }}>
                      <img
                        className=" object-fit-cover border rounded"
                        height="100"
                        width="200"
                        src={product.imageUrl}
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <del className="h6">原價 {product.origin_price}元</del>
                      <div className="h5">特價 {product.price}元</div>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={() => {
                          seeMore(product);
                        }}
                      >
                        查看更多
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        className="btn btn-outline-danger"
                        onClick={() => {
                          handleAddToCart(product.id, 1);
                        }}
                      >
                        加到購物車
                        {isLoading && (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only"></span>
                          </div>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal商品詳情 */}
      <div
        ref={productModalRef}
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          {productInfo ? (
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5" id="productModalLabel">
                  {productInfo.title}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeProductInfoModal}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  className="object-fit-cover border rounded"
                  width="300"
                  height="160"
                  src={productInfo.imageUrl}
                />
                <p>內容：{productInfo.content}</p>
                <p>描述：{productInfo.description}</p>
                <p>
                  價錢：{productInfo.origin_price}{' '}
                  <del>{productInfo.price}</del>元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
                  <select
                    value={qtySelect}
                    onChange={(event) => {
                      setQtySelect(event.target.value);
                    }}
                    id="qtySelect"
                    className="form-select"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  disabled={isLoading}
                  className="btn btn-primary d-flex align-items-center gap-2 "
                  onClick={() => {
                    handleAddToCart(productInfo.id, qtySelect);
                  }}
                >
                  <span className="text-nowrap">加入購物車</span>
                  {isLoading && (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>

      {/* 購物車清單 */}
      <div className="container">
        <h3 className="text-center mt-5 mb-2">購物車清單</h3>
        {cartData.carts?.length === 0 ? (
          <p className="text-center">目前購物車中沒有商品，趕快加入一些吧！</p>
        ) : (
          <>
            <div className="text-end mb-4">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleClearCart}
              >
                清空購物車
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}></th>
                    <th>品名</th>
                    <th style={{ width: '150px' }} className="text-center">
                      數量/單位
                    </th>
                    <th className="text-end">單價</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData.carts?.map((cart) => {
                    return (
                      <tr key={cart.id}>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                              handleRemoveItemCart(cart.id);
                            }}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </td>
                        <td>{cart.product.title}</td>
                        <td style={{ width: '150px' }} className="text-center">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-outline-dark"
                              disabled={cart.qty === 1}
                              onClick={() => {
                                handleIncreaseProductQty(cart.id, cart.qty - 1);
                              }}
                            >
                              -
                            </button>
                            <span
                              className="btn btn-outline-dark"
                              style={{ width: '40px', pointerEvents: 'none' }}
                            >
                              {cart.qty}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-dark"
                              onClick={() => {
                                handleIncreaseProductQty(cart.id, cart.qty + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end">{cart.final_total}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: '130px' }}>
                      {cartData.final_total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal 清除購物車確認 */}
      <div
        ref={clearCartModalRef}
        className="modal fade"
        id="clearCartModal"
        tabIndex="-1"
        aria-labelledby="clearCartModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="clearCartModalLabel">
                確定要清空購物車嗎？
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={closeClearCartModal}
              ></button>
            </div>
            <div className="modal-body">刪除後無法復原，請確認是否繼續。</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={clearCart}
              >
                清除購物車
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 收件人資訊 & 送出訂單 */}
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-lg-6 mb-5 pb-5">
            <h3 className="text-center mt-5">收件人資訊</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  電子郵件
                </label>
                <input
                  {...register('email', {
                    required: 'Email欄位必填',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '請輸入有效的 Email 格式',
                    },
                  })}
                  type="email"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  id="email"
                  placeholder="請輸入電子郵件"
                />
                {errors.email ? (
                  <div className="invalid-feedback">{errors.email.message}</div>
                ) : (
                  ''
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  姓名
                </label>
                <input
                  {...register('name', {
                    required: '姓名欄位必填',
                  })}
                  type="name"
                  className={`form-control ${errors.name && 'is-invalid'}`}
                  id="name"
                  placeholder="請輸入姓名"
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  電話
                </label>
                <input
                  {...register('tel', {
                    required: '電話欄位必填',
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: '請輸入有效的 電話 格式',
                    },
                  })}
                  type="text"
                  className={`form-control ${errors.tel && 'is-invalid'}`}
                  id="tel"
                  placeholder="請輸入電話"
                />
                {errors.tel && (
                  <div className="invalid-feedback">{errors.tel.message}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  地址
                </label>
                <input
                  {...register('address', {
                    required: '地址欄位必填',
                  })}
                  type="text"
                  className={`form-control ${errors.address && 'is-invalid'}`}
                  id="address"
                  placeholder="請輸入地址"
                />
                {errors.address && (
                  <div className="invalid-feedback">
                    {errors.address.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  備註留言
                </label>
                <textarea
                  {...register('message')}
                  name="message"
                  id="message"
                  className="form-control"
                  cols="30"
                  rows="5"
                ></textarea>
                <div className="invalid-feedback">請填寫正確的地址</div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={cartData?.carts?.length === 0}
                >
                  送出訂單
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
