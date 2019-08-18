import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { distanceInWordsToNow } from 'date-fns';
import { useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBan, faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

import { toggleCompleteTodo, updateTodo, deleteTodo } from '_store/actions/todos';
import ConfirmModal from '_organisms/ConfirmModal';

const fromNow = date => distanceInWordsToNow(date, { addSuffix: true });

export default function Todo({ id, createdAt, updatedAt, completed, text }) {
  const dispatch = useDispatch();

  const [currentText, setCurrentText] = useState(text);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [createdMessage, setCreatedMessage] = useState('');

  const updateMessages = () => {
    setUpdatedMessage(updatedAt ? fromNow(updatedAt) : '');
    setCreatedMessage(fromNow(createdAt));
  };

  useEffect(() => {
    updateMessages();
    const interval = window.setInterval(updateMessages, 1000);

    return () => clearInterval(interval);
  }, [updatedAt]);

  const openModal = () => setConfirm(true);
  const closeModal = () => setConfirm(false);
  const updateText = e => setCurrentText(e.target.value);
  const editTodo = () => setEdit(true);

  const cancelEdit = () => {
    setEdit(false);
    setCurrentText(text);
  };

  const handleUpdateTodo = () => {
    if (currentText) {
      setEdit(false);
      dispatch(updateTodo(id, currentText));
    }
  };

  const handleToggleCompleteTodo = () => dispatch(toggleCompleteTodo(id));
  const handleDeleteTodo = () => dispatch(deleteTodo(id));

  return (
    <li className="todo box">
      <article className="media">
        <figure className="media-left">
          <span className="icon" onClick={handleToggleCompleteTodo} onKeyPress={handleToggleCompleteTodo}>
            {completed
              ? <FontAwesomeIcon icon={faCheckSquare} size="lg" />
              : <FontAwesomeIcon icon={faSquare} size="lg" />}
          </span>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <small>
                {`created ${createdMessage}`}
              </small>
            </p>
            {edit ? (
              <textarea
                className="textarea"
                value={currentText}
                onChange={updateText}
              />
            ) : (
              <span>
                {text}
              </span>
            )}
          </div>

          <nav className="level is-mobile">
            <div className="level-left">
              {!!updatedAt && (
                <small>
                  {`edited ${updatedMessage}`}
                </small>
              )}
            </div>
            <div className="level-right">
              {edit ? (
                <span className="icon space-right" onClick={handleUpdateTodo} onKeyPress={handleUpdateTodo}>
                  <FontAwesomeIcon icon={faSave} size="lg" />
                </span>
              ) : (
                <span className="icon space-right" onClick={editTodo} onKeyPress={editTodo}>
                  <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                </span>
              )}
              {edit ? (
                <span className="icon" onClick={cancelEdit} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faBan} size="lg" />
                </span>
              ) : (
                <span className="icon" onClick={openModal} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </span>
              )}
            </div>
          </nav>
        </div>
      </article>
      <ConfirmModal
        confirm={confirm}
        closeModal={closeModal}
        deleteTodo={handleDeleteTodo}
      />
    </li>
  );
}

Todo.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  createdAt: PropTypes.number.isRequired,
  updatedAt: PropTypes.number,
};

Todo.defaultProps = {
  updatedAt: null,
};
