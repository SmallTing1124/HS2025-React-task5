import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function CartList({ setIsScreenLoading, getCart, cartData }) {
  useEffect(() => {
    getCart();
  }, []);

  // 確認清除購物車：Modal設定
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

  return (
    <>
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
    </>
  );
}

CartList.propTypes = {
  setIsScreenLoading: PropTypes.func.isRequired,
  getCart: PropTypes.func.isRequired,
  cartData: PropTypes.object.isRequired,
};

export default CartList;
