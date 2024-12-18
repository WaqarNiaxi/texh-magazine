"use client";

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const columns = [
  { field: "name", headerName: "Category Name", width: 150 },
  { field: "totalItems", headerName: "Total Items", width: 150 },
];

export default function DataTable() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: null, name: "", totalItems: 0 });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchCategories();
  }, []);

 

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      console.log(response)
      setRows(response?.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  const handleDialogOpen = (isEdit = false) => {
    if (isEdit) {
      const rowToEdit = rows.find((row) => row._id === selectedRows[0]);
      setFormData(rowToEdit || { _id: null, name: "", totalItems: 0 });
      setEditMode(true);
    } else {
      setFormData({ _id: null, name: "", totalItems: 0 });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setFormData({ _id: null, name: "", totalItems: 0 });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        const response = await axios.put(`/api/categories`, formData);

        setRows((prevRows) =>
          prevRows.map((row) => (row._id === formData._id ? response.data.category : row))
        );
      } else {
        const response = await axios.post("/api/categories", formData);
        setRows((prevRows) => [...prevRows, response.data.category]);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Send delete requests for each selected row
      await Promise.all(
        selectedRows.map((id) =>
          axios.delete("/api/categories", {
            data: { id }, // Pass the ID in the request body
          })
        )
      );
  
      // Update the rows state to remove deleted rows
      setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row._id)));
  
      // Clear the selected rows
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };
  

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
        Add Category
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDelete}
        disabled={selectedRows.length === 0}
        style={{ marginLeft: "10px" }}
      >
        Delete Selected
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => handleDialogOpen(true)}
        disabled={selectedRows.length !== 1}
        style={{ marginLeft: "10px" }}
      >
        Edit Category
      </Button>

      <Button variant="contained"
        color="secondary"
        style={{ marginLeft: "10px" }}
         onClick={() => router.push(`/admin/products/${selectedRows[0]}`)}
         disabled={selectedRows.length !== 1}
         >
          
          View Products</Button>



      <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          getRowId={(row) => row._id} // Use `_id` as the row ID
          sx={{ border: 0 }}
        />
      </Paper>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
