import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MyStudentCard = ({ firstName, lastName, grade }) => {
  return (
    <Card sx={{ minWidth: 170, backgroundColor: "#dde6ed", borderRadius: "20px" }}>
      <CardContent>
        <Typography sx={{ color: "#526d82" }} variant="h6" component="div">
          {firstName}
        </Typography>
        <Typography sx={{ color: "#526d82" }} variant="h7" component="div">
          {lastName}
        </Typography><br />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {grade}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ color: "#526d82", fontWeight: "bold" }}>Profile</Button>
      </CardActions>
    </Card>
  );
}

export default MyStudentCard;
