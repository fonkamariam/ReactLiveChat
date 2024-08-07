import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ContextMenu = ({ x, y, onEdit, onReply, onDelete, onClose }) => (
  <div
    className="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md p-2"
    style={{
      top: y,
      left: x,
    }}
  >
    <button className="flex items-center w-full p-2 hover:bg-gray-100" onClick={onEdit}>
      <FontAwesomeIcon icon={faEdit} className="mr-2" />
      Edit
    </button>
    <button className="flex items-center w-full p-2 hover:bg-gray-100" onClick={onReply}>
      <FontAwesomeIcon icon={faReply} className="mr-2" />
      Reply
    </button>
    <button className="flex items-center w-full p-2 hover:bg-gray-100" onClick={onDelete}>
      <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
      Delete
    </button>
  </div>
);

export default ContextMenu;
