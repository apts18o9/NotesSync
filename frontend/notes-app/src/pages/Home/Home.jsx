import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddImageSrc from '../../assets/addnote.jpg'
import NoDataImg from "../../assets/nodata.jpg"


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





  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    })
  }

  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([])

  const [isSearch, setIsSearch] = useState(false)
  //search query for note

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { q: query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }
  //getting user info;
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear("")
        navigate("/login")
      }

    }
  };

  // pinned a note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/update-note-pin/" + noteId, {
        "isPinned": !noteData.isPinned
      })

      if (response.data && response.data.note) {
        showToastMessage("Note Pinned Successfully")
        getAllNotes()
        
      }
    } catch (error) {
      console.log(error);
      
    }
  }


    //getting all notes
    const getAllNotes = async () => {
      try {
        const response = await axiosInstance.get("/get-notes");

        if (response.data && response.data.notes) {
          setAllNotes(response.data.notes)
        }
      }
      catch (error) {
        console.log("An unexpected error occured, Please try again later");

      }
    }

    //deleting a note

    const deleteNotes = async (data) => {
      const noteId = data._id

      try {
        const response = await axiosInstance.delete("/delete-note/" + noteId);

        if (response.data && !response.data.error) {
          getAllNotes()
          showToastMessage("Note Deleted Successfully", 'delete')
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError("An unexpected error occured, try again");
        }
      }
    }


    useEffect(() => {
      getAllNotes();
      getUserInfo();
      return () => { }
    }, []);




    return (
      <>

        <Navbar userInfo={userInfo} onSearchNote={onSearchNote} />

        <div className="container ml-8">
          {allNotes.length > 0 ? (
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
                  onDelete={() => deleteNotes(item)}
                  onPinNote={() =>  updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
              imgSrc={isSearch ? NoDataImg : AddImageSrc}
              message={isSearch
                ? `Oops! No notes found matching your search` : `Start creating your first note. Click the 'Add' button to note down your tasks, thoughts, ideas 
            and many more. Let's create and store `}
            />
          )}

        </div>

        <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600  absolute right-10 bottom-10'
          onClick={() => {
            setOpenAddEditModal({ isShown: true, data: null, type: "add" });
            // console.log('btn clicked');

          }}
        >
          <MdAdd className='text-[32px] text-white' />
        </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => { }}
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
            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
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
