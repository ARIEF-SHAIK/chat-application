import React from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { useState } from 'react'

const HomePage = () => {

  const[selectedUser,setSelectedUser] = useState(false)

  return (
    <div className="w-full h-100% bg-[linear-gradient(to_right,#ccc_1px,transparent_1px),linear-gradient(to_bottom,#ccc_1px,transparent_1px)] [background-size:20px_20px] bg-black">
    <div className='border w-full h-screen sm:px-[5%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser? 
      'md-grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]': 
        'md:grid-cols-2'} `}>
        <SideBar/>
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <RightSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </div>   
    </div>
    </div>
    
    
  )
}
export default HomePage
