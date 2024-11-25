import React, { useState, useEffect } from 'react';
import Albumlist from '../components/Albumlist';
import FormAddAlbum from '../components/FormAddAlbum';
import FormEditAlbum from '../components/FormEditAlbum';

const Album = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  const openEditModal = (album) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
    document.documentElement.classList.add('is-clipped');
  };

  const closeEditModal = () => {
    setSelectedAlbum(null);
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
      <h1 className='title'>Album</h1>
      <h2 className='subtitle'>Daftar Album</h2>
      
      <button className="button is-primary" onClick={openAddModal}>
        Tambah Album
      </button>

      <Albumlist onEdit={openEditModal} />

      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Tambah Album Baru</p>
              <button className="delete" aria-label="close" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddAlbum onClose={closeAddModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeAddModal}>Batal</button>
            </footer>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAlbum && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Album</p>
              <button className="delete" aria-label="close" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditAlbum album={selectedAlbum} onClose={closeEditModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeEditModal}>Batal</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Album;