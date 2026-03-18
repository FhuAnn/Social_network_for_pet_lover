import React, { useState, useEffect, useContext, useRef } from "react";
import PostInformationCard from "./PostInformationCard";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddReaction,
  AddPhotoAlternate,
  Comment,
  Share,
  MoreVert,
  ThumbUp,
  BookmarkBorder,
  Edit,
  Delete,
  VisibilityOff,
} from "@mui/icons-material";
import style from "./css/PostsDisplay.module.css";
import PostToolDisplay from "./PostToolDisplay";
import { Like, Post, User } from "../../../types";
import { PostProvider } from "./PostContext";
import PostRequestBar from "./PostRequestBar";
import { AccessUrlContext } from "../AccessUrlContext";
import { useParams } from "react-router-dom";

const PostsDisplay = () => {
  const [isDisplayTool, setIsDisplayTool] = useState(false);
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const { url, setUrl } = useContext(AccessUrlContext)!;

  // Dùng ref để tránh stale closure trong IntersectionObserver
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const urlRef = useRef(url);

  // Giữ urlRef luôn đồng bộ với url mới nhất
  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  const toggleDisplayToolBox = () => {
    setIsDisplayTool((prev) => !prev);
  };

  const fetchNext = async () => {
    const currentUrl = urlRef.current;
    if (!currentUrl || !hasMoreRef.current || isFetchingRef.current) return;
    isFetchingRef.current = true;
    const nextPage = pageRef.current + 1;
    try {
      const response = await fetch(`${currentUrl}&page=${nextPage}&limit=2`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Error in getting posts");
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        pageRef.current = nextPage;
        setPostsData((prev) => [...prev, ...data.posts]);
        setUser(data.user);
      } else {
        hasMoreRef.current = false;
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const updatePostsState = async () => {
    try {
      fetchNext();
    } catch (error) {
      console.error("Error updating post state:", error);
    }
  };

  // Reset và load trang đầu khi url thay đổi
  useEffect(() => {
    if (!url) return;
    pageRef.current = 0;
    hasMoreRef.current = true;
    isFetchingRef.current = false;
    setPostsData([]);
    fetchNext();
  }, [url]);

  // Setup observer CHỈ 1 LẦN — không phụ thuộc page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNext();
        }
      },
      { threshold: 1 },
    );

    const loadMoreTrigger = document.querySelector("#load-more-trigger");
    if (loadMoreTrigger) observer.observe(loadMoreTrigger);

    return () => observer.disconnect();
  }, []);
  // const handleHide = () => {
  //   console.log("Hide clicked");
  // };
  return (
    <Box sx={{ width: "100", mx: "auto", mt: 4 }}>
      {/* Top post input area */}
      <PostRequestBar
        user={user}
        toggleDisplayToolBox={toggleDisplayToolBox}
        isDisplayTool={isDisplayTool}
        updatePostsState={updatePostsState}
      />
      {postsData != undefined && postsData?.length > 0
        ? postsData?.map((post, index) => {
            return (
              <PostProvider post={post} key={post._id}>
                <PostInformationCard updatePostsState={updatePostsState} />
              </PostProvider>
            );
          })
        : "Don't have any post"}
      <div id="load-more-trigger"></div>
    </Box>
  );
};

export default PostsDisplay;
