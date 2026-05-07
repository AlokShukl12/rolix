import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import SortButton from "../../components/SortButton";
import Pagination from "../../components/Pagination";
import api from "../../api/client";
import { validateAddress, validateEmail, validateName, validatePassword } from "../../utils/validators";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [dashboardError, setDashboardError] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER"
  });
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState(null);
  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1
  });

  const [stores, setStores] = useState([]);
  const [storesPagination, setStoresPagination] = useState(null);
  const [storeFilters, setStoreFilters] = useState({
    name: "",
    email: "",
    address: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const loadDashboard = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
      setDashboardError("");
    } catch (err) {
      setDashboardError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  const loadUsers = async () => {
    const { data } = await api.get("/admin/users", { params: { ...userFilters, limit: 10 } });
    setUsers(data.data);
    setUsersPagination(data.pagination);
  };

  const loadStores = async () => {
    const { data } = await api.get("/admin/stores", { params: { ...storeFilters, limit: 10 } });
    setStores(data.data);
    setStoresPagination(data.pagination);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadUsers().catch(() => {});
  }, [userFilters]);

  useEffect(() => {
    loadStores().catch(() => {});
  }, [storeFilters]);

  const createUser = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    const nameError = validateName(userForm.name);
    const addressError = validateAddress(userForm.address);
    const passwordError = validatePassword(userForm.password);
    if (nameError || !validateEmail(userForm.email) || addressError || passwordError) {
      setFormError(nameError || (!validateEmail(userForm.email) ? "Invalid email." : "") || addressError || passwordError);
      return;
    }

    try {
      const { data } = await api.post("/admin/users", userForm);
      setFormMessage(data.message || "User created");
      setUserForm({ name: "", email: "", address: "", password: "", role: "USER" });
      loadUsers();
      loadDashboard();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create user");
    }
  };

  const createStore = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    if (!storeForm.name.trim() || storeForm.name.trim().length > 120 || !validateEmail(storeForm.email)) {
      setFormError("Store name (max 120) and valid email are required.");
      return;
    }
    const addressError = validateAddress(storeForm.address);
    if (addressError) {
      setFormError(addressError);
      return;
    }

    try {
      const payload = {
        name: storeForm.name,
        email: storeForm.email,
        address: storeForm.address,
        ownerId: storeForm.ownerId || undefined
      };
      const { data } = await api.post("/admin/stores", payload);
      setFormMessage(data.message || "Store created");
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      loadStores();
      loadDashboard();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create store");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      setSelectedUser(data);
    } catch {
      setSelectedUser(null);
    }
  };

  return (
    <Layout title="System Administrator Dashboard">
      {dashboardError && <p className="error">{dashboardError}</p>}
      <section className="stats-grid">
        <article className="card stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Stores</h3>
          <p>{stats.totalStores}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Ratings</h3>
          <p>{stats.totalRatings}</p>
        </article>
      </section>

      <section className="grid-two">
        <form className="card form-grid" onSubmit={createUser}>
          <h3>Create User</h3>
          <input
            placeholder="Name (20-60 chars)"
            value={userForm.name}
            onChange={(event) => setUserForm((p) => ({ ...p, name: event.target.value }))}
          />
          <input
            placeholder="Email"
            type="email"
            value={userForm.email}
            onChange={(event) => setUserForm((p) => ({ ...p, email: event.target.value }))}
          />
          <textarea
            rows={3}
            placeholder="Address"
            value={userForm.address}
            onChange={(event) => setUserForm((p) => ({ ...p, address: event.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            value={userForm.password}
            onChange={(event) => setUserForm((p) => ({ ...p, password: event.target.value }))}
          />
          <select
            value={userForm.role}
            onChange={(event) => setUserForm((p) => ({ ...p, role: event.target.value }))}
          >
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Store Owner</option>
          </select>
          <button className="button" type="submit">
            Add User
          </button>
        </form>

        <form className="card form-grid" onSubmit={createStore}>
          <h3>Create Store</h3>
          <input
            placeholder="Store Name"
            value={storeForm.name}
            onChange={(event) => setStoreForm((p) => ({ ...p, name: event.target.value }))}
          />
          <input
            placeholder="Store Email"
            type="email"
            value={storeForm.email}
            onChange={(event) => setStoreForm((p) => ({ ...p, email: event.target.value }))}
          />
          <textarea
            rows={3}
            placeholder="Store Address"
            value={storeForm.address}
            onChange={(event) => setStoreForm((p) => ({ ...p, address: event.target.value }))}
          />
          <input
            placeholder="Owner User ID (optional)"
            value={storeForm.ownerId}
            onChange={(event) => setStoreForm((p) => ({ ...p, ownerId: event.target.value }))}
          />
          <button className="button" type="submit">
            Add Store
          </button>
        </form>
      </section>

      {(formError || formMessage) && (
        <section className="card">
          {formError && <p className="error">{formError}</p>}
          {formMessage && <p className="success">{formMessage}</p>}
        </section>
      )}

      <section className="card">
        <h3>Users</h3>
        <div className="filter-grid">
          <input
            placeholder="Filter by Name"
            value={userFilters.name}
            onChange={(event) => setUserFilters((p) => ({ ...p, name: event.target.value, page: 1 }))}
          />
          <input
            placeholder="Filter by Email"
            value={userFilters.email}
            onChange={(event) => setUserFilters((p) => ({ ...p, email: event.target.value, page: 1 }))}
          />
          <input
            placeholder="Filter by Address"
            value={userFilters.address}
            onChange={(event) => setUserFilters((p) => ({ ...p, address: event.target.value, page: 1 }))}
          />
          <select
            value={userFilters.role}
            onChange={(event) => setUserFilters((p) => ({ ...p, role: event.target.value, page: 1 }))}
          >
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <SortButton
                  label="Name"
                  field="name"
                  sortBy={userFilters.sortBy}
                  sortOrder={userFilters.sortOrder}
                  onSortChange={(field, order) => setUserFilters((p) => ({ ...p, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>
                <SortButton
                  label="Email"
                  field="email"
                  sortBy={userFilters.sortBy}
                  sortOrder={userFilters.sortOrder}
                  onSortChange={(field, order) => setUserFilters((p) => ({ ...p, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>Address</th>
              <th>
                <SortButton
                  label="Role"
                  field="role"
                  sortBy={userFilters.sortBy}
                  sortOrder={userFilters.sortOrder}
                  onSortChange={(field, order) => setUserFilters((p) => ({ ...p, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.address}</td>
                <td>{item.role}</td>
                <td>
                  <button type="button" className="button ghost small" onClick={() => fetchUserDetails(item._id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagination={usersPagination}
          onPageChange={(page) => setUserFilters((prev) => ({ ...prev, page }))}
        />
      </section>

      {selectedUser && (
        <section className="card">
          <h3>User Details</h3>
          <p>Name: {selectedUser.user.name}</p>
          <p>Email: {selectedUser.user.email}</p>
          <p>Address: {selectedUser.user.address}</p>
          <p>Role: {selectedUser.user.role}</p>
          {selectedUser.user.role === "OWNER" && <p>Rating: {selectedUser.ownerRating ?? 0}</p>}
        </section>
      )}

      <section className="card">
        <h3>Stores</h3>
        <div className="filter-grid">
          <input
            placeholder="Filter by Name"
            value={storeFilters.name}
            onChange={(event) => setStoreFilters((p) => ({ ...p, name: event.target.value, page: 1 }))}
          />
          <input
            placeholder="Filter by Email"
            value={storeFilters.email}
            onChange={(event) => setStoreFilters((p) => ({ ...p, email: event.target.value, page: 1 }))}
          />
          <input
            placeholder="Filter by Address"
            value={storeFilters.address}
            onChange={(event) => setStoreFilters((p) => ({ ...p, address: event.target.value, page: 1 }))}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <SortButton
                  label="Name"
                  field="name"
                  sortBy={storeFilters.sortBy}
                  sortOrder={storeFilters.sortOrder}
                  onSortChange={(field, order) => setStoreFilters((p) => ({ ...p, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>
                <SortButton
                  label="Email"
                  field="email"
                  sortBy={storeFilters.sortBy}
                  sortOrder={storeFilters.sortOrder}
                  onSortChange={(field, order) => setStoreFilters((p) => ({ ...p, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.address}</td>
                <td>{item.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagination={storesPagination}
          onPageChange={(page) => setStoreFilters((prev) => ({ ...prev, page }))}
        />
      </section>
    </Layout>
  );
};

export default AdminDashboardPage;
