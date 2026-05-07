import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import SortButton from "../../components/SortButton";
import api from "../../api/client";

const OwnerDashboardPage = () => {
  const [data, setData] = useState({ stores: [], averageRating: 0, ratings: [] });
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const loadDashboard = async () => {
    try {
      const response = await api.get("/owner/dashboard");
      setData(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load owner dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const sortedRatings = useMemo(() => {
    const sorted = [...data.ratings];
    sorted.sort((a, b) => {
      let aValue = "";
      let bValue = "";
      if (sortBy === "name") {
        aValue = a.user?.name || "";
        bValue = b.user?.name || "";
      } else if (sortBy === "email") {
        aValue = a.user?.email || "";
        bValue = b.user?.email || "";
      } else {
        aValue = a.rating;
        bValue = b.rating;
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data.ratings, sortBy, sortOrder]);

  const onSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <Layout title="Store Owner Dashboard">
      {error && <p className="error">{error}</p>}
      <section className="stats-grid owner-one">
        <article className="card stat-card">
          <h3>Average Rating</h3>
          <p>{data.averageRating}</p>
        </article>
      </section>

      <section className="card">
        <h3>Your Stores</h3>
        {data.stores.length === 0 ? (
          <p>No store assigned to this owner yet.</p>
        ) : (
          <ul className="store-list">
            {data.stores.map((store) => (
              <li key={store._id}>{store.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Users Who Submitted Ratings</h3>
        <table>
          <thead>
            <tr>
              <th>
                <SortButton
                  label="Name"
                  field="name"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                />
              </th>
              <th>
                <SortButton
                  label="Email"
                  field="email"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                />
              </th>
              <th>Address</th>
              <th>Store</th>
              <th>
                <SortButton
                  label="Rating"
                  field="rating"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRatings.map((item) => (
              <tr key={item.id}>
                <td>{item.user?.name}</td>
                <td>{item.user?.email}</td>
                <td>{item.user?.address}</td>
                <td>{item.store?.name}</td>
                <td>{item.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default OwnerDashboardPage;
