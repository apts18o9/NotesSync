import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'

const NoteCard = ({
    title,
    date,
    content, 
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
 }) => {
  return (
    <div className='border rounded bg-white hover:shadow-lg transition-all ease-in-out flex flex-col justify-between p-3  w-full  relative'>
      {/* Top Section: Title, Date, Pin */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className='text-xs text-slate-500'>{date}</span>
          </div>
          <MdOutlinePushPin
            className={`icon-btn ml-2 mt-1 ${isPinned ? 'text-primary' : 'text-slate-300'}`}
            onClick={onPinNote}
            size={18}
          />
        </div>
        <p className='text-xs text-slate-600 mt-1'>{content?.slice(0, 60)}</p>
      </div>

      {/* Bottom Section: Tags, Edit/Delete */}
      <div className='flex justify-between items-center mt-2'>
        <div className='text-xs text-slate-500'>{tags}</div>
        <div className='flex items-center gap-1'>
          <MdCreate
            className='icon-btn hover:text-green-600'
            onClick={onEdit}
            size={16}
          />
          <MdDelete
            className='icon-btn hover:text-red-600'
            onClick={onDelete}
            size={16}
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
