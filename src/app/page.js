"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import UserList from "@/components/userList";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AddUserButton from "@/components/AddUserButton";
import FormDropDownBuilder from "@/components/FormDropDownBuilder";

export default function Home() {
  const [imageType, setImageType] = useState("Identicon");

  useEffect(() => {
    const savedImageType = localStorage.getItem("imageType") || "Identicon";
    setImageType(savedImageType);
  }, []);

  const handleImageTypeChange = (id, val) => {
    setImageType(val);
    localStorage.setItem("imageType", val);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Random User Directory</h1>
          <p>
            This page displays a list of randomly generated users along with
            their basic details. You can click on any user to view more
            information. The user list is refreshed on every page reload, so the
            results may differ each time.
          </p>
        </div>
        <div className={styles.controlsContainer}>
          <div className={styles.controlsRow}>
            <AddUserButton />
            <AddUserButton path={"/form"} title={"Contact US"} />
            <AddUserButton path={"/tic-tak"} title={"Tik Tak"} />
          </div>
          <div className={styles.dropdownContainer}>
            <FormDropDownBuilder
              id={"imageType"}
              onChange={handleImageTypeChange}
              labelName={"Profile Image Model"}
              items={[
                "Adventurer",
                "Adventurer Neutral",
                "Avataaars",
                "Avataaars Neutral",
                "Big Ears",
                "Big Ears Neutral",
                "Big Smile",
                "Bottts",
                "Bottts Neutral",
                "Croodles",
                "Croodles Neutral",
                "Dylan",
                "Fun Emoji",
                "Glass",
                "Icons",
                "Identicon",
                "Lorelei",
                "Lorelei Neutral",
                "Micah",
                "Miniavs",
                "Notionists",
                "Notionists Neutral",
                "Open Peeps",
                "Personas",
                "Pixel Art",
                "Pixel Art Neutral",
                "Rings",
                "Shapes",
                "Thumbs",
              ]}
              value={imageType}
            />
          </div>
        </div>
        <UserList />
        <SpeedInsights />
      </main>
    </div>
  );
}
