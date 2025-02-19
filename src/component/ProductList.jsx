import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductList({ isLoading, setIsLoading, setIsScreenLoading ,getCart}) {
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
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
    </>
  );
}

ProductList.propTypes = {
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func.isRequired,
  setIsScreenLoading: PropTypes.func.isRequired,
  getCart: PropTypes.func.isRequired,
};

export default ProductList;
