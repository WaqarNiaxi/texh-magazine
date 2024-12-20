"use client";

import { allPosts } from "contentlayer/generated";
import { usePathname } from "next/navigation";
import styles from "./Topic.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { compareDesc } from "date-fns";
import PostPreview from "@/components/PostPreview/PostPreview";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

function Topic() {
  const pathname = usePathname();
  const topicName = pathname.replace("/topic/", "").toLowerCase();
  const [formData, setFormData] = useState([]);

  interface Category {
    _id: string;
    name: string;
    totalItems: number;
    __v: number;
  }
  
  interface Product {
    _id: string;
    name: string;
    image?: string; 
    detail: string;
    category: Category;
    __v: number;
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/products");
console.log("response")
console.log(response)
      setFormData(response?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Generate cards for the fetched formData
  const productCards = (formData as Product[]) 
  .filter((product) => product.category.name.toUpperCase() === topicName.toUpperCase()) 
  .map((product) => (
    <Card sx={{ maxWidth: 345, margin: 2 }} key={product._id}>
      <CardMedia
        sx={{ height: 140 }}
        image={product.image || "/static/images/cards/default-image.jpg"}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.detail}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Category: {product.category.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => console.log(product)}>
          Share
        </Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ));


  

  // Get posts specific to the topic in question
  const posts = allPosts
    .filter((post) => {
      const topicsInLowerCase = post.topics.toString().toLowerCase();
      return topicsInLowerCase.includes(topicName);
    })
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // Generate previews of posts
  const postPreviews = posts.map((post, idx) => (
    <PostPreview key={idx} {...post} />
  ));

  return (
    <div className={styles.TopicPageContainer}>
      <ToastContainer />
      <div className={`${styles.CardsContainer} topic-card`}>{productCards}</div>
      <div className="ListPosts">{postPreviews}</div>
    </div>
  );
}

export default Topic;
