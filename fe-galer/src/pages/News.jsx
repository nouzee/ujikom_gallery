import React, { useState, useEffect } from 'react';
import Newslist from '../components/Newslist';
import FormAddNews from '../components/FormAddNews';
import FormEditNews from '../components/FormEditNews';

const News = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  const openEditModal = (news) => {
    setSelectedNews(news);
    setIsEditModalOpen(true);
    document.documentElement.classList.add('is-clipped');
  };

  const closeEditModal = () => {
    setSelectedNews(null);
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
      <h1 className='title'>News</h1>
      <h2 className='subtitle'>List Of News</h2>
      
      <button className="button is-primary" onClick={openAddModal}>
        Add News
      </button>

      <Newslist onEdit={openEditModal} />

      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add New News</p>
              <button className="delete" aria-label="close" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddNews onClose={closeAddModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeAddModal}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedNews && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit News</p>
              <button className="delete" aria-label="close" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditNews news={selectedNews} onClose={closeEditModal} />
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

export default News;