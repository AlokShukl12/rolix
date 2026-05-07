import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import SortButton from "../../components/SortButton";
import Pagination from "../../components/Pagination";
import api from "../../api/client";

const UserDashboardPage = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    sortBy: "name",
    sortOrder: "asc",
    page: 1
  });
  const [ratingDraft, setRatingDraft] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadStores = async () => {
    try {
      const { data } = await api.get("/user/stores", { params: { ...filters, limit: 10 } });
      setStores(data.data);
      setPagination(data.pagination);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stores");
    }
  };

  useEffect(() => {
    loadStores();
  }, [filters]);

  const submitRating = async (storeId) => {
    const value = Number(ratingDraft[storeId]);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      setMessage("");
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      await api.post(`/user/stores/${storeId}/rating`, { rating: value });
      setMessage("Rating saved successfully.");
      setError("");
      loadStores();
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Failed to save rating");
    }
  };

  return (
    <Layout title="Normal User Dashboard">
      <section className="card">
        <h3>Registered Stores</h3>
        <div className="filter-grid two-col">
          <input
            placeholder="Search by Name"
            value={filters.name}
            onChange={(event) => setFilters((prev) => ({ ...prev, name: event.target.value, page: 1 }))}
          />
          <input
            placeholder="Search by Address"
            value={filters.address}
            onChange={(event) => setFilters((prev) => ({ ...prev, address: event.target.value, page: 1 }))}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <table>
          <thead>
            <tr>
              <th>
                <SortButton
                  label="Store Name"
                  field="name"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={(field, order) => setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>
                <SortButton
                  label="Address"
                  field="address"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={(field, order) => setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: order }))}
                />
              </th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Submit / Modify Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.overallRating}</td>
                <td>{store.userSubmittedRating ?? "-"}</td>
                <td>
                  <div className="rating-cell">
                    <select
                      value={ratingDraft[store._id] ?? store.userSubmittedRating ?? 1}
                      onChange={(event) =>
                        setRatingDraft((prev) => ({
                          ...prev,
                          [store._id]: event.target.value
                        }))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <button className="button small" type="button" onClick={() => submitRating(store._id)}>
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
      </section>
    </Layout>
  );
};

export default UserDashboardPage;
