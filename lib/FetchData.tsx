"use client";
import { useState } from "react";
import axios from "axios";
// IMPORT file upload
// TODO make it general, so that the user can import data separately, like import transactions, import charges etc
export async function uploadFile(file: File) {
  //const [file, setFile] = useState<File | null>(null);
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   console.log("Handling import");
  //   try {
  //     if (!file) return; // no file
  //     const formData = new FormData();
  //     formData.append("file", file); // add the form data to the file state
  //     const result = await axios.post(
  //       "http://localhost:4000/upload",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     ); // send form data with axios, form data contains the file
  //     return result.data.filename;
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
}
