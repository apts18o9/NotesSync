import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    data: null,
    type: "add",
  });

  //showing toast message
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const handleCloseToast = () =>{
    setShowToastMsg({
      isShown: false,
      message: "",
    })
  }

  const showToastMesage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    })
  }

  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([])
  
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type:"edit"})
  }
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

  //getting all notes
  const getAllNotes = async () => {
    try{
      const response = await axiosInstance.get("/get-notes");

      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    }
    catch(error){
      console.log("An unexpected error occured, Please try again later");
      
    }
  }


  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {}
  }, []);

  return (
    <>

      <Navbar userInfo={userInfo} />

      <div className="container ml-8">
        <div className='grid grid-cols-2 gap-2 mt-4'>
          {allNotes.map((item, index) => (
            <NoteCard 
            key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => {}}
            onPinNote={() => {}}
            />
          ))} 
          

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
          getAllNotes={getAllNotes}
          showToastMesage={showToastMesage}
        />
      </Modal >

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home
