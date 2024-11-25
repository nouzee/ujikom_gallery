import React, { useState, useEffect } from 'react';
import Eventlist from '../components/Eventlist';
import FormAddEvent from '../components/FormAddEvent';
import FormEditEvent from '../components/FormEditEvent';

const Event = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
    document.documentElement.classList.add('is-clipped');
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      document.documentElement.classList.add('is-clipped');
    }
    return () => {
      document.documentElement.classList.remove('is-clipped');
    };
  }, [isAddModalOpen, isEditModalOpen]);

  return (
    <div className='h-full'>
      <h1 className='title'>Events</h1>
      <h2 className='subtitle'>List Of Events</h2>
      
      <button className="button is-primary" onClick={openAddModal}>
        Add Event
      </button>

      <Eventlist onEdit={openEditModal} />

      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add New Event</p>
              <button className="delete" aria-label="close" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddEvent onClose={closeAddModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeAddModal}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedEvent && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Event</p>
              <button className="delete" aria-label="close" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditEvent event={selectedEvent} onClose={closeEditModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeEditModal}>Cancel</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;