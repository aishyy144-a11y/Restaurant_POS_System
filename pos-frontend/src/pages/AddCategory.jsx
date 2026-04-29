import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../https";
import BackButton from "../components/shared/BackButton";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    bgColor: "#b73e3e",
    icon: "",
    image: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory(formData);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-[#f5f5f5] min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-800">Add Category</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              name="bgColor"
              value={formData.bgColor}
              onChange={handleChange}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm p-1 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Icon (Emoji)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="e.g. 🍔"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
