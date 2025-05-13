import React, { useState } from 'react'
import TagInput from '../../components/Input/Taginput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
const AddEditNotes = ({noteData, type, getAllNotes ,onClose  }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);


    const [error, setError] = useState(null)

    //to add new note(to be implemented)
    const addNewNote = async () => {
      try{
        const response = await axiosInstance.post("/add-note", {
          title,
          content, 
          tags,
        });

        if(response.data && response.data.note){
          getAllNotes();
          onClose();
        }
      }catch(error){
        if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
      }
    }
    
    //to edit note(to be implemented)
    const editNote = async () => {}
    const handleAddNote = () => {
        if(!title){
            setError("Please add Title")
            return;
        }

        if(!content){
            setError("Please enter content")
            return;
        }

        setError("");

        if(type === "edit"){
            editNote();
        }
        else{
            addNewNote();
        }
    }
  return (
    <div className='relative'>
        <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose} >
            <MdClose className='text-xl text-slate-400'/>
        </button>

        <div className='flex flex-col gap-2'>
            <label className='input-label'>Title</label>
            <input
                type="text"
                className='text-2xl text-slate-950 outline-none'
                placeholder='Do something'
                value={title}
                onChange={({ target}) => setTitle(target.value)}
            />
        </div>
      
      <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>CONTENT</label>
            <textarea
                type="text"
                className='text-sm text-slate-950 outline-none rounded-none p-2'
                placeholder='content'
                rows={10}
                value={content}
                onChange={({ target}) => setContent(target.value)}
            />
      </div>

      <div>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button className='btn-primary font-medium mt-5 pt-3' onClick={handleAddNote}>
        ADD
      </button>
    </div>
  )
    
}
export default AddEditNotes
