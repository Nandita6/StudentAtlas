import { useState, useEffect } from "react";
import "./MyProfile.css";

// This component allows users to enter and edit their profile information.
function MyProfile() {

  // Store all the information entered by the user.
  const [profile, setProfile] = useState({
    fullName: "",
    school: "",
    degree: "",
    graduationDate: "",
    skills: "",
    interests: "",
    dateOfBirth: ""
  });

  // Load the saved profile information when the page opens.
  useEffect(() => {
    async function loadProfile() {
      try {
        // Get the saved profile from the backend database.
        const response = await fetch("/api/profile");

        // Check if the backend returned the information successfully.
        if (!response.ok) {
          throw new Error("Failed to load profile.");
        }

        // Convert the response into JavaScript data.
        const savedProfile = await response.json();

        // Only update the form if a saved profile exists.
        if (savedProfile.id) {
          setProfile({
            fullName: savedProfile.full_name || "",
            school: savedProfile.university || "",
            degree: savedProfile.degree || "",
            graduationDate: savedProfile.graduation_date || "",
            skills: savedProfile.skills || "",
            interests: savedProfile.interests || "",
            dateOfBirth: savedProfile.date_of_birth || ""
          });
        }
      } catch (error) {
        // Show an error in the console if loading fails.
        console.error("Error loading profile:", error);
      }
    }

    loadProfile();
  }, []);

  // Update the profile whenever the user changes a field.
  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value
    }));
  }

  // Save the profile information to the backend database.
  async function handleSave(event) {
    // Prevent the page from refreshing when the form is submitted.
    event.preventDefault();

    try {
      // Send the profile information to the backend.
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...profile,
          university: profile.school
        })
      });

      // Check if the backend saved the profile successfully.
      if (!response.ok) {
        throw new Error("Failed to save profile.");
      }

      // Let the user know their profile was saved.
      alert("Profile saved successfully!");
    } catch (error) {
      // Show an error message if something goes wrong.
      console.error("Error saving profile:", error);
      alert("Unable to save profile. Please try again.");
    }
  }

  return (
    <section className="my-profile">
      <h1>My Profile</h1>

      <p className="page-description">
        Add and manage your personal and academic information.
      </p>

      <form className="profile-form" onSubmit={handleSave}>

        {/* Full name */}
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </label>

        {/* School or university */}
        <label>
          School / University
          <input
            type="text"
            name="school"
            value={profile.school}
            onChange={handleChange}
          />
        </label>

        {/* Degree or area of study */}
        <label>
          Degree / Area of Study
          <input
            type="text"
            name="degree"
            value={profile.degree}
            onChange={handleChange}
          />
        </label>

        {/* Expected graduation date */}
        <label>
          Graduation Date
          <input
            type="date"
            name="graduationDate"
            value={profile.graduationDate}
            onChange={handleChange}
          />
        </label>

        {/* Skills */}
        <label>
          Skills
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Enter your skills"
          />
        </label>

        {/* Career interests */}
        <label>
          Interests
          <textarea
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            placeholder="Enter your interests"
          />
        </label>

        {/* Date of birth */}
        <label>
          Date of Birth
          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
          />
        </label>

        {/* Save the profile information */}
        <button type="submit">
          Save Profile
        </button>

      </form>
    </section>
  );
}

export default MyProfile;