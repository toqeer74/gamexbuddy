import React from "react";
import { useParams } from "react-router-dom";
import NewsFeed from "@/components/NewsFeed";
import "@/styles/home.css";

export default function NewsTag(){
  const { tag } = useParams<{ tag: string }>();
  return <NewsFeed initialTag={tag} />
}
