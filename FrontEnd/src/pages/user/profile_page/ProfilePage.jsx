import React from "react";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import Navbar from "../../../components/user_components/navbar/Navbar";

const ProfilePage = () => {
  return (
    <div className="text-black h-screen">
      <Navbar />
      <ProfileNavbar />

      {/* Details Section */}
      <div className="px-10 mt-4 flex items-center gap-5">
        {/* img */} <div className="h-28 w-28 bg-black rounded-full"></div>

        {/* details */}
        <div>
            <h1>Shamsheed Ali</h1>
            <h3>StepUp Member Since October 2024</h3>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
