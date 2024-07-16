import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { io } from "socket.io-client";

const PORT = 8080;

const socket = io(`http://localhost:${PORT}`);

const App = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchDishes();
    socket.on("dishUpdated", fetchDishes);
    return () => {
      socket.off("dishUpdated", fetchDishes);
    };
  }, []);

  const fetchDishes = async () => {
    const response = await axios.get(`http://localhost:${PORT}/dishes`);
    setDishes(response.data);
  };

  const toggleDishStatus = async (id, currentValue) => {
    const isPublished = (currentValue) => (currentValue == 1 ? 0 : 1);
    await axios.put(
      `http://localhost:8080/dishes/${id}/toggle/${isPublished(currentValue)}`
    );
  };

  return (
    <Container>
      <Grid container spacing={4}>
        {dishes.map((dish) => (
          <Grid item key={dish.dish_id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={dish.image_url}
                alt={dish.dish_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {dish.dish_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dish.is_published === 1 ? "Published" : "Unpublished"}
                </Typography>
                <Button
                  variant="contained"
                  color={dish.is_published === 1 ? "secondary" : "primary"}
                  onClick={() =>
                    toggleDishStatus(dish.dish_id, dish.is_published)
                  }
                >
                  {dish.is_published === 1 ? "Unpublish" : "Publish"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
