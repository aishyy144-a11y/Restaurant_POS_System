import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoMdClose, IoMdTrash, IoMdArrowBack, IoMdSave } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTable, addCategory, addDish, getCategories, deleteCategory, getDishesByCategory, deleteDish, updateDish, getTables, deleteTable, getDishes } from "../../https";
import { enqueueSnackbar } from "notistack";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";

const Modal = ({ setIsModalOpen, modalType }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
    hall: "Family Hall",
  });

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: null,
  });

  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    category: "",
    isAvailable: true,
    image: null,
    qtyUnit: "", // Default empty to allow manual input
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
  const [dishesForDelete, setDishesForDelete] = useState([]);
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] = useState(null);
  const [dishesForUpdate, setDishesForUpdate] = useState([]);
  const [tablesForDelete, setTablesForDelete] = useState([]);
  const [selectedHallForDelete, setSelectedHallForDelete] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [preview, setPreview] = useState(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (modalType === "dish" || modalType === "deleteCategory" || modalType === "deleteDish" || modalType === "updateDish") {
      const fetchCategories = async () => {
        try {
          const res = await getCategories();
          setCategories(res.data.data.categories);
        } catch (error) {
          console.error(error);
          enqueueSnackbar("Failed to fetch categories", { variant: "error" });
        }
      };
      fetchCategories();
    }

    if (modalType === "deleteTable") {
      const fetchTables = async () => {
        try {
          const res = await getTables();
          setTablesForDelete(res.data.data);
        } catch (error) {
          console.error(error);
          enqueueSnackbar("Failed to fetch tables", { variant: "error" });
        }
      };
      fetchTables();
    }
  }, [modalType]);

  const handleTableChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImageBlob], "cropped-image.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(file);

      if (modalType === "category") {
        setCategoryData((prev) => ({ ...prev, image: file }));
      } else if (modalType === "dish") {
        setDishData((prev) => ({ ...prev, image: file }));
      }
      
      setPreview(previewUrl);
      setShowCropper(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Something went wrong while cropping", { variant: "error" });
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      handleFileSelect(e, "category");
    } else if (name === "name") {
      // Allow only alphabets and spaces
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setCategoryData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setCategoryData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDishChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "image") {
      handleFileSelect(e, "dish");
    } else if (type === "checkbox") {
      setDishData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "name") {
      // Allow only alphabets and spaces
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setDishData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setDishData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setIsModalOpen(false);
      enqueueSnackbar(res.data.message, { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["dashboardStats"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }) => updateDish(id, data),
    onSuccess: (res) => {
      enqueueSnackbar("Dish price updated successfully", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (reqData) => {
      const formData = new FormData();
      formData.append("name", reqData.name);
      if (reqData.image) {
        formData.append("image", reqData.image);
      }
      return addCategory(formData);
    },
    onSuccess: (res) => {
      setIsModalOpen(false);
      enqueueSnackbar("Category added successfully!", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["dashboardStats"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const dishMutation = useMutation({
    mutationFn: (reqData) => {
      const formData = new FormData();
      formData.append("name", reqData.name);
      formData.append("price", reqData.price);
      formData.append("category", reqData.category);
      formData.append("isAvailable", reqData.isAvailable);
      formData.append("qtyUnit", reqData.qtyUnit); // Send unit to backend
      if (reqData.image) {
        formData.append("image", reqData.image);
      }
      return addDish(formData);
    },
    onSuccess: (res) => {
      setIsModalOpen(false);
      enqueueSnackbar("Dish added successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
      queryClient.invalidateQueries(["dashboardStats"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: (res, variables) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      // Refresh the local list as well
      setCategories((prev) => prev.filter((cat) => cat._id !== variables));
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: (id) => deleteDish(id),
    onSuccess: (res, variables) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      // Refresh the local list
      setDishesForDelete((prev) => prev.filter((d) => d._id !== variables));
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: (id) => deleteTable(id),
    onSuccess: (res, variables) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      setTablesForDelete((prev) => prev.filter((t) => t._id !== variables));
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", {
        variant: "error",
      });
    },
  });

  const handleDeleteTable = (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      deleteTableMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleCategorySelectForDelete = async (category) => {
    setSelectedCategoryForDelete(category);
    try {
      const res = await getDishesByCategory(category._id);
      setDishesForDelete(res.data.data.dishes);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to fetch dishes", { variant: "error" });
    }
  };

  const handleDeleteDish = (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      deleteDishMutation.mutate(id);
    }
  };

  const handleCategorySelectForUpdate = async (category) => {
    setSelectedCategoryForUpdate(category);
    try {
      const res = await getDishesByCategory(category._id);
      setDishesForUpdate(res.data.data.dishes);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to fetch dishes", { variant: "error" });
    }
  };

  const handleUpdateDish = (dish) => {
    updateDishMutation.mutate({ id: dish._id, data: { price: dish.price } });
  };

  const handlePriceChange = (e, dishId) => {
    const newPrice = e.target.value;
    setDishesForUpdate(prev => prev.map(d => d._id === dishId ? { ...d, price: newPrice } : d));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === "table") {
      tableMutation.mutate(tableData);
    } else if (modalType === "category") {
      categoryMutation.mutate(categoryData);
    } else if (modalType === "dish") {
      dishMutation.mutate(dishData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreview(null);
    setSelectedCategoryForDelete(null);
    setDishesForDelete([]);
    setSelectedCategoryForUpdate(null);
    setDishesForUpdate([]);
    setSelectedHallForDelete(null);
  };

  // Theme-aware classes
  const modalBg = isDark ? "bg-[#262626]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";
  const inputBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-blue-900";
  const closeBtnHover = isDark ? "hover:text-red-500" : "hover:text-red-600";

  const getModalTitle = () => {
    if (modalType === "table") return "Add Table";
    if (modalType === "category") return "Add Category";
    if (modalType === "dish") return "Add Dish";
    if (modalType === "deleteCategory") return "Delete Category";
    if (modalType === "deleteDish") return selectedCategoryForDelete ? `Delete Dish - ${selectedCategoryForDelete.name}` : "Delete Dish - Select Category";
    if (modalType === "updateDish") return selectedCategoryForUpdate ? `Update Dish - ${selectedCategoryForUpdate.name}` : "Update Dish - Select Category";
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-4">
      {showCropper ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[500px] relative flex flex-col">
          <div className="relative flex-1 bg-gray-200">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(e.target.value)
                }}
                className="zoom-range"
              />
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setShowCropper(false);
                        setImageSrc(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCropSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Save
                </button>
            </div>
          </div>
        </div>
      ) : (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${modalBg} p-4 rounded-lg shadow-lg w-[300px] my-4`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className={`${textColor} text-xl font-semibold`}>
            {getModalTitle()}
          </h2>
          <button
            onClick={handleCloseModal}
            className={`${textColor} ${closeBtnHover}`}
          >
            <IoMdClose size={24} />
          </button>
        </div>
        
        {modalType === "deleteTable" && selectedHallForDelete && (
          <button 
            onClick={() => setSelectedHallForDelete(null)} 
            className={`flex items-center gap-1 text-sm bg-blue-900 text-white px-3 py-1 rounded mb-2 hover:bg-blue-800 transition`}
          >
            <IoMdArrowBack /> Back to Halls
          </button>
        )}

        {modalType === "deleteDish" && selectedCategoryForDelete && (
          <button 
            onClick={() => setSelectedCategoryForDelete(null)} 
            className={`flex items-center gap-1 text-sm bg-blue-900 text-white px-3 py-1 rounded mb-2 hover:bg-blue-800 transition`}
          >
            <IoMdArrowBack /> Back to Categories
          </button>
        )}

        {modalType === "updateDish" && selectedCategoryForUpdate && (
          <button 
            onClick={() => setSelectedCategoryForUpdate(null)} 
            className={`flex items-center gap-1 text-sm bg-blue-900 text-white px-3 py-1 rounded mb-2 hover:bg-blue-800 transition`}
          >
            <IoMdArrowBack /> Back to Categories
          </button>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
          {modalType === "table" && (
            <>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Select Hall
                </label>
                <div className={`flex gap-4 mb-2 p-2 ${inputBg} rounded-lg`}>
                  <label className={`flex items-center cursor-pointer ${inputText}`}>
                    <input 
                      type="radio" 
                      name="hall" 
                      value="Family Hall" 
                      checked={tableData.hall === "Family Hall"} 
                      onChange={handleTableChange} 
                      className="mr-2 cursor-pointer"
                    />
                    Family Hall
                  </label>
                  <label className={`flex items-center cursor-pointer ${inputText}`}>
                    <input 
                      type="radio" 
                      name="hall" 
                      value="Gents Hall" 
                      checked={tableData.hall === "Gents Hall"} 
                      onChange={handleTableChange} 
                      className="mr-2 cursor-pointer"
                    />
                    Gents Hall
                  </label>
                </div>
              </div>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Table Number
                </label>
                <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                  <input
                    type="number"
                    name="tableNo"
                    value={tableData.tableNo}
                    onChange={handleTableChange}
                    className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Number of Seats
                </label>
                <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                  <input
                    type="number"
                    name="seats"
                    value={tableData.seats}
                    onChange={handleTableChange}
                    className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {modalType === "deleteTable" && !selectedHallForDelete && (
            <div className="space-y-2">
              <div 
                onClick={() => setSelectedHallForDelete("Family Hall")}
                className={`flex items-center justify-between p-3 rounded-lg ${inputBg} cursor-pointer hover:bg-opacity-80 transition`}
              >
                <span className={`${inputText} font-medium`}>Family Hall</span>
                <span className={`${textSecondary} text-sm`}>
                  {tablesForDelete.filter(t => (t.hall || "Family Hall") === "Family Hall").length} Tables
                </span>
              </div>
              <div 
                onClick={() => setSelectedHallForDelete("Gents Hall")}
                className={`flex items-center justify-between p-3 rounded-lg ${inputBg} cursor-pointer hover:bg-opacity-80 transition`}
              >
                <span className={`${inputText} font-medium`}>Gents Hall</span>
                <span className={`${textSecondary} text-sm`}>
                  {tablesForDelete.filter(t => t.hall === "Gents Hall").length} Tables
                </span>
              </div>
            </div>
          )}

          {modalType === "deleteTable" && selectedHallForDelete && (
            <div className="space-y-2">
              {tablesForDelete.filter(t => (t.hall || "Family Hall") === selectedHallForDelete).length === 0 ? (
                <p className={`${textSecondary} text-center`}>No tables found in {selectedHallForDelete}.</p>
              ) : (
                tablesForDelete
                  .filter(t => (t.hall || "Family Hall") === selectedHallForDelete)
                  .map((table) => (
                    <div key={table._id} className={`flex items-center justify-between p-2 rounded-lg ${inputBg}`}>
                      <span className={`${inputText} font-medium`}>Table {table.tableNo} ({table.seats} seats)</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTable(table._id)}
                        disabled={deleteTableMutation.isPending}
                        className="text-red-500 hover:text-red-700 transition p-1"
                      >
                        <IoMdTrash size={20} />
                      </button>
                    </div>
                  ))
              )}
            </div>
          )}

          {modalType === "category" && (
            <>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Category Name
                </label>
                <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                  <input
                    type="text"
                    name="name"
                    value={categoryData.name}
                    onChange={handleCategoryChange}
                    className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Choose Image
                </label>
                <div className={`flex flex-col items-center justify-center rounded-lg p-2 px-3 ${inputBg}`}>
                  {preview ? (
                    <div className="w-full h-20 mb-2 rounded-lg overflow-hidden relative group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setCategoryData((prev) => ({ ...prev, image: null }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-20 mb-2 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image Selected
                    </div>
                  )}

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleCategoryChange}
                    className={`bg-transparent w-full ${inputText} focus:outline-none`}
                  />
                </div>
              </div>
            </>
          )}

          {modalType === "dish" && (
            <>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Dish Name
                </label>
                <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                  <input
                    type="text"
                    name="name"
                    value={dishData.name}
                    onChange={handleDishChange}
                    className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                    Price
                  </label>
                  <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                    <input
                      type="number"
                      name="price"
                      value={dishData.price}
                      onChange={handleDishChange}
                      className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                    Per Unit
                  </label>
                  <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                    <input
                      type="text"
                      name="qtyUnit"
                      value={dishData.qtyUnit}
                      onChange={handleDishChange}
                      placeholder="e.g. 1 Plate, 4 Pieces"
                      className={`bg-transparent flex-1 ${inputText} focus:outline-none w-full`}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Category
                </label>
                <div className={`flex item-center rounded-lg p-2 px-3 ${inputBg}`}>
                  <select
                    name="category"
                    value={dishData.category}
                    onChange={handleDishChange}
                    className={`bg-transparent flex-1 ${inputText} focus:outline-none w-full`}
                    required
                  >
                    <option value="" className="text-gray-800">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="text-gray-800">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block ${textSecondary} mb-1 mt-1 text-sm font-medium`}>
                  Choose Image
                </label>
                <div className={`flex flex-col items-center justify-center rounded-lg p-2 px-3 ${inputBg}`}>
                  {preview ? (
                    <div className="w-full h-20 mb-2 rounded-lg overflow-hidden relative group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setDishData((prev) => ({ ...prev, image: null }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-20 mb-2 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image Selected
                    </div>
                  )}

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleDishChange}
                    className={`bg-transparent w-full ${inputText} focus:outline-none`}
                  />
                </div>
              </div>
            </>
          )}

          {modalType === "deleteCategory" && (
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className={`${textSecondary} text-center`}>No categories found.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className={`flex items-center justify-between p-2 rounded-lg ${inputBg}`}>
                    <span className={`${inputText} font-medium`}>{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat._id)}
                      disabled={deleteCategoryMutation.isPending}
                      className="text-red-500 hover:text-red-700 transition p-1"
                    >
                      <IoMdTrash size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {modalType === "deleteDish" && !selectedCategoryForDelete && (
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className={`${textSecondary} text-center`}>No categories found.</p>
              ) : (
                categories.map((cat) => (
                  <div 
                    key={cat._id} 
                    onClick={() => handleCategorySelectForDelete(cat)}
                    className={`flex items-center justify-between p-2 rounded-lg ${inputBg} cursor-pointer hover:bg-opacity-80 transition`}
                  >
                    <span className={`${inputText} font-medium`}>{cat.name}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {modalType === "deleteDish" && selectedCategoryForDelete && (
             <div className="space-y-2">
              {dishesForDelete.length === 0 ? (
                <p className={`${textSecondary} text-center`}>No dishes found in this category.</p>
              ) : (
                dishesForDelete.map((dish) => (
                  <div key={dish._id} className={`flex items-center justify-between p-2 rounded-lg ${inputBg}`}>
                    <span className={`${inputText} font-medium`}>{dish.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`${textSecondary} text-sm`}>{dish.price}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(dish._id)}
                        disabled={deleteDishMutation.isPending}
                        className="text-red-500 hover:text-red-700 transition p-1"
                      >
                        <IoMdTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {modalType === "updateDish" && !selectedCategoryForUpdate && (
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className={`${textSecondary} text-center`}>No categories found.</p>
              ) : (
                categories.map((cat) => (
                  <div 
                    key={cat._id} 
                    onClick={() => handleCategorySelectForUpdate(cat)}
                    className={`flex items-center justify-between p-2 rounded-lg ${inputBg} cursor-pointer hover:bg-opacity-80 transition`}
                  >
                    <span className={`${inputText} font-medium`}>{cat.name}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {modalType === "updateDish" && selectedCategoryForUpdate && (
             <div className="space-y-2">
              {dishesForUpdate.length === 0 ? (
                <p className={`${textSecondary} text-center`}>No dishes found in this category.</p>
              ) : (
                dishesForUpdate.map((dish) => (
                  <div key={dish._id} className={`flex items-center justify-between p-2 rounded-lg ${inputBg}`}>
                    <span className={`${inputText} font-medium flex-1`}>{dish.name}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={dish.price}
                        onChange={(e) => handlePriceChange(e, dish._id)}
                        className={`w-20 p-1 rounded ${isDark ? "bg-[#262626] text-white" : "bg-white text-black"} border border-gray-400 focus:outline-none`}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateDish(dish)}
                        disabled={updateDishMutation.isPending}
                        className="text-green-500 hover:text-green-700 transition p-1"
                        title="Save Price"
                      >
                        <IoMdSave size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {modalType !== "deleteCategory" && modalType !== "deleteDish" && modalType !== "updateDish" && modalType !== "deleteTable" && (
          <button
            type="submit"
            disabled={tableMutation.isPending || categoryMutation.isPending || dishMutation.isPending}
            className={`w-full rounded-lg mt-4 mb-2 py-2 text-lg font-bold ${
              tableMutation.isPending || categoryMutation.isPending || dishMutation.isPending
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-yellow-400 text-gray-900"
            }`}
          >
            {tableMutation.isPending || categoryMutation.isPending || dishMutation.isPending
              ? "Processing..."
              : getModalTitle()}
          </button>
          )}
        </form>
      </motion.div>
      )}
      </div>
    </div>
  );
};

export default Modal;
