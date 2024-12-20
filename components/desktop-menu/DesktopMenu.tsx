"use client";

import styles from "./DesktopMenu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
interface ITEM{
  name:string;
}

function DesktopMenu() {
  const pathname = usePathname();
const [formData, setFormData] = useState([]);
const topicName = pathname.replace("/topic/", "");

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      console.log(response)
      setFormData(response?.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  return (
    <div className={styles.DesktopMenu}>
      {formData?.map((item:ITEM) => (
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          href={item?.name}
          className={`${
            item?.name === topicName
              ? styles.ActiveLinkWrapper
              : styles.InactiveLinkWrapper
          }`}
          key={item.name}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default DesktopMenu;
