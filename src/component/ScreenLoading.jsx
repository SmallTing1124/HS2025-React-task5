import PropTypes from 'prop-types';

import ReactLoading from 'react-loading';

function ScreenLoading({ isScreenLoading }) {
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
    </>
  );
}

ScreenLoading.propTypes = {
  isScreenLoading: PropTypes.bool,
};

export default ScreenLoading;
