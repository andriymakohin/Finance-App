import React, { createRef, useEffect } from "react";
import { modalEdit } from "../../redux/Slice";

//Moment
import moment from "moment";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Operations
import { removePost, setPost } from "../Operations/operationsBD";

//Components
import ChangeTransactionForm from "./ChangeTransactionForm/ChangeTransactionForm";

//Style
import styles from "./ChangeTransaction.module.css";


const ChangeTransaction = () => {
  const backdropRef = createRef();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  });

  const handleKeyPress = (e) => {
    if (e.code !== "Escape") {
      return;
    }

    closeModal();
  };

  const handleBackdropClick = (e) => {
    if (backdropRef.current && e.target !== backdropRef.current) {
      return;
    }

    closeModal();
  };

  const closeModal = () => {
    dispatch(modalEdit(false));
  };

  // const addTransaction = (e) => {
  //   e.preventDefault();
  //   dispatch(setPost());
  // };
  const addTransaction = async (submittedData, idOldTransaction) => {
    await dispatch(modalEdit(false));
    await dispatch(removePost(idOldTransaction, session.token));
    let { typeOfTransaction, timeOfTransaction, value, category, comment } = submittedData;
    const transactionDate = moment(timeOfTransaction, "DD/MM/YYYY").toISOString();

    const reqData = {
      type: typeOfTransaction,
      transactionDate,
      amount: +value,
      category,
      comment,
    };

    await dispatch(setPost(session.token, reqData));
  };

  return (
    <div className={styles.backdrop} ref={backdropRef} onClick={handleBackdropClick} role="presentation">
      <div className={styles.modal}>
        <ChangeTransactionForm closeModalAddTransaction={closeModal} addTransaction={addTransaction} />
      </div>
    </div>
  );
};

export default ChangeTransaction;
