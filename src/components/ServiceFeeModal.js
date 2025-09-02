import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setServiceFeeModal } from '../store/slices/uiSlice';
import './ServiceFeeModal.css';

const ServiceFeeModal = () => {
  const dispatch = useDispatch();
  const { showServiceFeeModal } = useSelector(state => state.ui);

  const handleClose = () => {
    dispatch(setServiceFeeModal(false));
  };

  if (!showServiceFeeModal) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content service-fee-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Service Fees</h2>
        
        <div className="modal-text">
          <p>
            We Know Group charges a Service Fee on bookings. This Service Fee covers the costs 
            associated with running and maintaining the Self-Service Machines. Service Fees are 
            non-refundable on cancellation. By making your booking you agree to pay this charge.
          </p>
        </div>
        
        <button className="modal-close-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ServiceFeeModal;