import React from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getAllUsers, deleteUser } from "../../https/index";
import { FaTrash } from "react-icons/fa";

const Users = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const queryClient = useQueryClient();

  const { data: resData, isError, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getAllUsers();
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
        enqueueSnackbar("User deleted successfully", { variant: "success" });
        queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
        console.error("Delete error:", error);
        let errMsg = error?.response?.data?.message || error?.message || "Failed to delete user";
        
        // Custom message for 404 (Route not found vs User not found)
        if (error?.response?.status === 404 && !error?.response?.data?.message) {
            errMsg = "Feature not loaded. Please RESTART BACKEND server.";
        }
        
        enqueueSnackbar(errMsg, { variant: "error" });
    }
  });

  const handleDelete = (id, name) => {
    if(!id) {
        enqueueSnackbar("Invalid User ID", { variant: "error" });
        return;
    }
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
        deleteMutation.mutate(id);
    }
  }

  if (isError) {
    enqueueSnackbar(error?.message || "Something went wrong!", { variant: "error" });
  }

  const rawUsers = resData?.data?.data || [];
  
  // Sort users: Manager/Sub admin first
  const users = [...rawUsers].sort((a, b) => {
    const roleA = a.role?.toLowerCase();
    const roleB = b.role?.toLowerCase();
    const isManagerA = roleA === "sub admin" || roleA === "manager";
    const isManagerB = roleB === "sub admin" || roleB === "manager";
    
    if (isManagerA && !isManagerB) return -1;
    if (!isManagerA && isManagerB) return 1;
    return 0;
  });

  const containerBg = isDark ? "bg-[#262626]" : "bg-sky-100";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const theadBg = isDark ? "bg-[#333]" : "bg-sky-200";
  const theadText = isDark ? "text-[#ababab]" : "text-blue-800";
  const rowHover = isDark ? "hover:bg-[#333]" : "hover:bg-sky-200";
  const borderColor = isDark ? "border-gray-600" : "border-sky-300";

  if (isLoading) {
    return <div className={`container mx-auto p-4 ${textColor}`}>Loading users...</div>;
  }

  const formatPhone = (phone) => {
    let p = String(phone).trim().replace(/\s+/g, "").replace(/^\+/, "");
    if (p.startsWith("92")) {
      p = p.substring(2);
    }
    if (p.startsWith("0")) {
      p = p.substring(1);
    }
    return `+92 ${p}`;
  };

  return (
    <div className={`container mx-auto ${containerBg} p-2 md:p-4 rounded-lg`}>
      <h2 className={`${textColor} text-lg md:text-xl font-semibold mb-4`}>
        Users
      </h2>
      <div className="overflow-x-auto scrollbar-hide">
        <table className={`w-full text-left ${textColor} min-w-[600px]`}>
          <thead className={`${theadBg} ${theadText}`}>
            <tr>
              <th className="p-2 md:p-3 text-sm md:text-base">Name</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Email</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Phone</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Role</th>
              <th className="p-2 md:p-3 text-sm md:text-base text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={`border-b ${borderColor} ${rowHover}`}
              >
                <td className="p-2 md:p-4 text-sm md:text-base font-medium">{user.name}</td>
                <td className="p-2 md:p-4 text-sm md:text-base">{user.email}</td>
                <td className="p-2 md:p-4 text-sm md:text-base whitespace-nowrap">{formatPhone(user.phone)}</td>
                <td className="p-2 md:p-4 text-sm md:text-base capitalize">
                  <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                    user.role?.toLowerCase() === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role?.toLowerCase() === 'manager' || user.role?.toLowerCase() === 'sub admin' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-2 md:p-4 text-center">
                  <button 
                    onClick={() => handleDelete(user._id, user.name)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <FaTrash size={14} className="md:w-4 md:h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
