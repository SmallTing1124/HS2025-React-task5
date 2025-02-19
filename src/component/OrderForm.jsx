import PropTypes from 'prop-types';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function OrderForm({ setIsScreenLoading, getCart, cartData }) {
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

OrderForm.propTypes = {
  setIsScreenLoading: PropTypes.func.isRequired,
  getCart: PropTypes.func.isRequired,
  cartData: PropTypes.object.isRequired,
};

export default OrderForm;
