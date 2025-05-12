import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    data: null,
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate();

  //getting user info;
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
      setUserInfo(response.data.user);
    }
    }catch(error){
      if(error.response.status === 401){
        localStorage.clear("")
        navigate("/login")
      }

    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {}
  }, []);

  return (
    <>

      <Navbar userInfo={userInfo} />

      <div className="container ml-8">
        <div className='grid grid-cols-3 gap-2 mt-4'>
          <NoteCard 
            title="India war"
            date="7 May 2025"
            content="India fires at Porkistan"
            tags="#war"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
            />

        </div>
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600  absolute right-10 bottom-10'
        onClick={()=>{
          setOpenAddEditModal({ isShown: true, data: null, type: "add" });
          // console.log('btn clicked');
          
        }}
        >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal 
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>{}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={()=>{
            setOpenAddEditModal({ isShown:false, type: "add", data: null})
          }}
        />
      </Modal >
    </>
  )
}

export default Home
