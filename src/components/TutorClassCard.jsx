import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import course1 from "../Images/course1.jpg";

const TutorClassCard = ({ subject }) => {
  return (
    <div className="class-card">
      <Card sx={{ maxWidth: 500 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            image={course1}
            alt="green iguana"
          />
          <CardContent className="class-card-content">
            <div className="class-card-title">
              <Typography gutterBottom variant="h5" component="div">
                {subject.Subject}
              </Typography>
            </div>
            <div className="class-card-grade">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ color: "#27374d", fontSize: "18px", mt: 0.5 }}
              >
                Grade {subject.Grade}
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default TutorClassCard;
