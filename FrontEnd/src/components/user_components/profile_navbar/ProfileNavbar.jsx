import React from 'react'
import {Link} from 'react-router-dom'

const ProfileNavbar = () => {
  return (
    <div className='font-bold font-clash-display mt-5 text-black'>
      <nav className='flex items-center justify-center w-full text-base'>
        <ul className='flex gap-8'>
            <Link to={'/profile'}>Profile</Link>
            <li>Orders</li>
            <li>Favourites</li>
            <Link to={'/profile/settings'}>Settings</Link>
        </ul>
      </nav>
    </div>
  )
}

export default ProfileNavbar
