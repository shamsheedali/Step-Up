import React from 'react'
import productImg from '../../../assets/images/auth/nike.png'

const ProductCard = () => {
  return (
    <div className='bg-[#d6d7da] w-[300px] p-8 rounded-xl' style={{ boxShadow: "5px 4px 8px #00000099" }}>
      <div>
        <img src={productImg} alt="" className='w-[240px] rotate-[320deg] relative right-[33px] bottom-[37px]' />
      </div>
      <div>
        <h2>Nike Air Max 90 LV8</h2>
        <p>₹14599</p>
      </div>
    </div>
  )
}

export default ProductCard
