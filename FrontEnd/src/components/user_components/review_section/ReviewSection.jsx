import React from "react";
import profilePhoto from '../../../assets/images/homepage/Bibin Profile pic.jpeg'

const ReviewSection = () => {
  return (
    <div className="text-black font-bold px-10 font-clash-display">
      <hr />
      <div className=" flex p-10 gap-8">
        <div>
          <img src={profilePhoto} alt="Profile Photo" className="w-[90px] h-[90px] rounded-[50%] object-cover" />
        </div>
        <div>
          <h1 className="text-lg">Bibin Riji</h1>
          <p className="text-sm text-gray-600">July 16, 2024</p>
          {/* rating */}
          <div className="rating">
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              defaultChecked
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
          </div>
          <h3>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</h3>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
