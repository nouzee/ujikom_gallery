import React, { useState, useEffect } from 'react';
import Categorylist from '../components/Categorylist';
import FormAddCategory from '../components/FormAddCategory';
import FormEditCategory from '../components/FormEditCategory';

const Category = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
    document.documentElement.classList.add('is-clipped');
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
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
      <h1 className='title'>Category</h1>
      <h2 className='subtitle'>List Of Categories</h2>
      
      <button className="button is-primary" onClick={openAddModal}>
        Add Category
      </button>

      <Categorylist onEdit={openEditModal} />

      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add New Category</p>
              <button className="delete" aria-label="close" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddCategory onClose={closeAddModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeAddModal}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedCategory && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Category</p>
              <button className="delete" aria-label="close" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditCategory category={selectedCategory} onClose={closeEditModal} />
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

export default Category;
