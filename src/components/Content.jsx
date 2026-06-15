import React, { useState } from "react";
import ContentHeader from "./ContentHeader";
import "../styles/content.css";
import Card from "./Card";
import TutorsList from "./TutorsList";
import StudentsList from "./StudentsList";
import ParentsList from "./ParentsList";
import SubjectsList from "./SubjectsList";
import Profile from "./Profile";


const Content = () => {
  const [selectedCard, setSelectedCard] = useState("All Students");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleCardClick = (title) => {
    setSelectedCard(title);
    setSelectedUserId(null);
  };

  return (
    <div className="content">
      <ContentHeader header="Dashboard" />
      <div className="admin-dashboard-container">
        <div className="card-content">
          <Card onCardClick={handleCardClick} selectedCard={selectedCard} />
          {selectedCard === "All Students" && (
            <StudentsList onSelectUser={setSelectedUserId} />
          )}
          {selectedCard === "All Tutors" && (
            <TutorsList onSelectUser={setSelectedUserId} />
          )}
          {selectedCard === "All Parents" && (
            <ParentsList onSelectUser={setSelectedUserId} />
          )}
          {selectedCard === "All Subjects" && <SubjectsList />}
        </div>
        <div className="profile-content">
          <Profile userId={selectedUserId} />
        </div>
      </div>
    </div>
  );
};

export default Content;
