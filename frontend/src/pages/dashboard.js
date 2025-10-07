// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/authcontext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]); // State for properties

  // Fetch all users when the component loads (if admin/broker)
  useEffect(() => {
    const fetchUsers = async () => {
      // Only fetch users if the current user is admin or broker
      if (user?.role === "admin" || user?.role === "broker") {
        try {
          const res = await api.get("/users"); // Axios interceptor adds token
          setUsers(res.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          alert("Failed to load users. You might not be authorized.");
        }
      } else {
        setUsers([]); // Clear users if not authorized
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch all properties when the component loads
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/property"); // Axios interceptor adds token
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Properties might be public or require auth, adjust as needed
        alert("Failed to load properties.");
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome, {user?.fname}!
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Role Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Your Role:{" "}
          <span className="text-blue-600 font-bold uppercase">
            {user?.role}
          </span>
        </h2>
      </div>

      {/* User List (only visible to admins/brokers) */}
      {(user?.role === "admin" || user?.role === "broker") && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            All Registered Users
          </h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border">#</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Phone</th>
                    <th className="py-2 px-4 border">City</th>
                    <th className="py-2 px-4 border">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-2 px-4 border text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border">
                        {u.fname} {u.lname}
                      </td>
                      <td className="py-2 px-4 border">{u.email}</td>
                      <td className="py-2 px-4 border">{u.phone}</td>
                      <td className="py-2 px-4 border">{u.city}</td>
                      <td className="py-2 px-4 border capitalize text-blue-600 font-semibold">
                        {u.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No users found.</p>
          )}
        </div>
      )}

      {/* Property List (visible to all, but can be restricted) */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Properties
        </h2>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p._id} className="border rounded-lg p-4 shadow-sm">
                <img
                  src={p.picture || "https://via.placeholder.com/150"} // Placeholder image
                  alt={p.pname}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-xl font-bold text-gray-800">{p.pname}</h3>
                <p className="text-gray-600 mt-1">{p.description}</p>
                <p className="text-lg font-semibold text-blue-700 mt-2">
                  ${p.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No properties found.</p>
        )}
      </div>

      {/* Normal user message (This section is redundant if properties are shown to all,
          but kept for original logic. You might remove it if the property list is
          the main content for all users.) */}
      {user?.role === "user" && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-2">User Dashboard Overview</h2>
          <p>
            You are logged in as a <b>regular user</b>. You can view available properties.
            Please contact a broker or admin for further assistance or to list your own property.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;