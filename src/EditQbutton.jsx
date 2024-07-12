import React, { useState } from "react";
import Modal from 'react-modal';
import EditQuiz from './editQuiz';
import editImage from "./assets/edit.png";
import { FaTimes } from 'react-icons/fa'; // Import the FaTimes cross icon from react-icons/fa

const EditQButton = ({ admin }) => {
  const [isEditQuizModalOpen, setEditQuizModalOpen] = useState(false);

  const handleOpenEditQuizModal = () => {
    setEditQuizModalOpen(true);
  };

  const handleCloseEditQuizModal = () => {
    setEditQuizModalOpen(false);
  };

  return (
    <div>
      {admin && (
        <div>
          <Modal
            isOpen={isEditQuizModalOpen}
            onRequestClose={handleCloseEditQuizModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                maxHeight: '80vh',
                overflowY: 'auto',
                borderRadius: '10px',
                padding: '20px',
              },
            }}
            shouldCloseOnOverlayClick={true}
          >
            <button
              onClick={handleCloseEditQuizModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'black',
              }}
            >
              <FaTimes /> {/* Replace 'Close' text with FaTimes cross icon */}
            </button>
            <EditQuiz />
          </Modal>
          <div onClick={handleOpenEditQuizModal} className="flex items-center">
            <img src={editImage} alt="Edit" className="w-4 h-4 mr-2" />
            Edit Quiz
          </div>
        </div>
      )}
    </div>
  );
};

export default EditQButton;
