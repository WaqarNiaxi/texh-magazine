"use client";

import { allPosts, Post } from "contentlayer/generated";
import { usePathname } from "next/navigation";
import styles from "./Topic.module.css";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { compareDesc } from "date-fns";
import PostPreview from "@/components/PostPreview/PostPreview";
import Button from '@mui/material/Button';

function Topic() {
  const pathname = usePathname();
  const topicName = pathname.replace("/topic/", "").toLowerCase();

  // get posts specific to topic in question
  const posts = allPosts
    .filter((post) => {
      // convert topics array to lowercase to search for matches
      const topicsInLowerCase = post.topics.toString().toLowerCase();
      return topicsInLowerCase.includes(topicName);
    })
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // generate previews of posts
  const postPreviews = posts.map((post: any, idx: any) => (
    <PostPreview key={idx} {...post} />
  ));
  const notify = () => toast("Wow so easy!");
  return (
    <div className={styles.TopicPageContainer}>
      <ToastContainer />
      <h1 className="TopicTitle">{topicName.toUpperCase()}</h1>
      <div className="ListPosts">{postPreviews}</div>
    </div>
  );
}

export default Topic;
