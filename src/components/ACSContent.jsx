import React from "react";
import "../styles/content.css";
import AddClass from "./AddClass";
import ContentHeader from "./ContentHeader";
import DisplayClass from "./DisplayClass";

const ACSContent = () => {
  return (
    <div className="content">
      <ContentHeader header="Class Schedule" />
      <div className="addclass-container">
        <div>
          <AddClass className="addclass-content" />
        </div>
        <div className="displayclass-content">
          <DisplayClass />
        </div>
      </div>
    </div>
  );
};

export default ACSContent;
