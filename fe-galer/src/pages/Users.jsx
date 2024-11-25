import React, { useState, useEffect } from 'react';
import Userlist from '../components/Userlist';
import FormAddUser from '../components/FormAddUser';
import FormEditUser from '../components/FormEditUser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const Users = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError, user} = useSelector((state) => state.auth);

  useEffect(() => {
    if(user && user.role !== "admin"){
      navigate("/dashboard/welcome");
    }
  }, [isError, user, navigate]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.documentElement.classList.remove('is-clipped');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    document.documentElement.classList.add('is-clipped');
  };

  const closeEditModal = () => {
    setSelectedUser(null);
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
      <h1 className='title'>Users</h1>
      <h2 className='subtitle'>List of Users</h2>

      <button className="button is-primary" onClick={openAddModal}>
        Add User
      </button>
    
      <Userlist onEdit={openEditModal} />

      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add New User</p>
              <button className="delete" aria-label="close" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddUser onClose={closeAddModal} />
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeAddModal}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit User</p>
              <button className="delete" aria-label="close" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditUser user={selectedUser} onClose={closeEditModal} />
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

export default Users;