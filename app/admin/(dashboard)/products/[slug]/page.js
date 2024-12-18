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
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { field: "name", headerName: "Product Name", width: 150 },
  { field: "description", headerName: "Description", width: 300 },
];

export default function ProductPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    description: "",
    image: null, // Updated to handle file
    category: slug,
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?category=${slug}`);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  const handleDialogOpen = (isEdit = false) => {
    if (isEdit) {
      const rowToEdit = rows.find((row) => row._id === selectedRows[0]);
      setFormData(rowToEdit || { _id: null, name: "", description: "", image: null });
      setEditMode(true);
    } else {
      setFormData({ _id: null, name: "", description: "", image: null });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setFormData({ _id: null, name: "", description: "", image: null });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Name and category are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("image", formData.image);
      data.append("category", slug);

      let response;

      if (editMode) {
        data.append("_id", formData._id);
        response = await fetch("/api/products", {
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
      }

      if (response.ok) {
        const result = await response.json();
        setRows((prevRows) =>
          editMode
            ? prevRows.map((row) => (row._id === formData._id ? result.product : row))
            : [...prevRows, result.product]
        );
        handleDialogClose();
        fetchProducts(); // Refresh rows after successful action
      } else {
        const error = await response.json();
        toast.error(error.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRows.length) {
      toast.error("Please select at least one product to delete.");
      return;
    }

    try {
      const response = await axios.delete("/api/products", {
        data: { ids: selectedRows },
      });

      if (response.status === 200) {
        setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row._id)));
        setSelectedRows([]);
        toast.success("Product(s) deleted successfully.");
      } else {
        toast.error("Error deleting product(s).");
      }
    } catch (error) {
      console.error("Error deleting product(s):", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Product Management</h1>
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
          onClick={() => handleDialogOpen(false)}
        >
          Add Product
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginRight: "10px" }}
          onClick={() => handleDialogOpen(true)}
          disabled={selectedRows.length !== 1}
        >
          Edit Product
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
          Delete Product(s)
        </Button>
      </Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(ids) => handleSelectionChange(ids)}
        autoHeight
      />
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
          />
          <input type="file" name="image" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
