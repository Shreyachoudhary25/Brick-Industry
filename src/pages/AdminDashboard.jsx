import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Package,
  LogOut,
  RefreshCw,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  X,
} from "lucide-react";

const INQUIRY_STATUSES = ["New", "Under Review", "Closed"];
const RFQ_STATUSES = [
  "New",
  "Under Review",
  "Quotation Sent",
  "Accepted",
  "Rejected",
];
const STOCK_STATUSES = ["In Stock", "Low Stock", "Made to Order"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("quotes");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Clay Bricks",
    pricePerUnit: "",
    moq: "5000",
    strength: "",
    dimensions: "",
    stockStatus: "In Stock",
    imageUrl: "",
    description: "",
  });

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const [resQuotes, resInquiries, resProducts] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/quotes`, {
          headers: authHeaders,
        }),
        fetch(`${API_BASE_URL}/api/admin/inquiries`, {
          headers: authHeaders,
        }),
        fetch(`${API_BASE_URL}/api/products`),
      ]);

      if (resQuotes.status === 401 || resInquiries.status === 401) {
        handleLogout();
        return;
      }

      if (resQuotes.ok) {
        setQuotes(await resQuotes.json());
      }

      if (resInquiries.ok) {
        setInquiries(await resInquiries.json());
      }

      if (resProducts.ok) {
        setProducts(await resProducts.json());
      }
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchData();
    }
  }, [token]);

  const handleQuoteStatusChange = async (quoteId, nextStatus) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/quotes/${quoteId}/status`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) =>
            q._id === quoteId
              ? { ...q, status: nextStatus }
              : q
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquiryStatusChange = async (
    inquiryId,
    nextStatus
  ) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/inquiries/${inquiryId}/status`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) =>
            i._id === inquiryId
              ? { ...i, status: nextStatus }
              : i
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);

    setProductForm({
      name: "",
      category: "Clay Bricks",
      pricePerUnit: "",
      moq: "5000",
      strength: "",
      dimensions: "",
      stockStatus: "In Stock",
      imageUrl: "",
      description: "",
    });

    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProductId(p._id);

    setProductForm({
      name: p.name,
      category: p.category || "Clay Bricks",
      pricePerUnit: p.pricePerUnit,
      moq: p.moq || 5000,
      strength: p.strength,
      dimensions: p.dimensions,
      stockStatus: p.stockStatus || "In Stock",
      imageUrl: p.imageUrl || "",
      description: p.description || "",
    });

    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    try {
      const method = editingProductId ? "PUT" : "POST";

      const url = editingProductId
        ? `${API_BASE_URL}/api/admin/products/${editingProductId}`
        : `${API_BASE_URL}/api/admin/products`;

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        setShowProductModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (res.ok) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (
      !window.confirm("Delete this quotation request?")
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/quotes/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (res.ok) {
        setQuotes((prev) =>
          prev.filter((q) => q._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/inquiries/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (res.ok) {
        setInquiries((prev) =>
          prev.filter((i) => i._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "New":
        return {
          backgroundColor: "#E3F2FD",
          color: "#1565C0",
          borderColor: "#BBDEFB",
        };

      case "Under Review":
        return {
          backgroundColor: "#FFF8E1",
          color: "#F57F17",
          borderColor: "#FFE082",
        };

      case "Quotation Sent":
        return {
          backgroundColor: "#EDE7F6",
          color: "#512DA8",
          borderColor: "#D1C4E9",
        };

      case "Accepted":
      case "In Stock":
        return {
          backgroundColor: "#E8F5E9",
          color: "#2E7D32",
          borderColor: "#C8E6C9",
        };

      case "Low Stock":
        return {
          backgroundColor: "#FFF3E0",
          color: "#E65100",
          borderColor: "#FFE0B2",
        };

      case "Rejected":
      case "Closed":
      case "Made to Order":
        return {
          backgroundColor: "#FFEBEE",
          color: "#C62828",
          borderColor: "#FFCDD2",
        };

      default:
        return {
          backgroundColor: "#F5F5F5",
          color: "#616161",
          borderColor: "#E0E0E0",
        };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          backgroundColor: "#4A2C23",
          color: "#FFF",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              backgroundColor: "#A63D2F",
              padding: "6px 10px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            BRICKWORKS
          </div>

          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Operations Control Panel
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={fetchData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#FFF",
              padding: "0.5rem 0.9rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#A63D2F",
              border: "none",
              color: "#FFF",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1350px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setActiveTab("quotes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.4rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                backgroundColor:
                  activeTab === "quotes"
                    ? "#A63D2F"
                    : "#EAEAEA",
                color:
                  activeTab === "quotes"
                    ? "#FFF"
                    : "#555",
              }}
            >
              <FileText size={18} />
              RFQs & Quotes ({quotes.length})
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.4rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                backgroundColor:
                  activeTab === "inquiries"
                    ? "#A63D2F"
                    : "#EAEAEA",
                color:
                  activeTab === "inquiries"
                    ? "#FFF"
                    : "#555",
              }}
            >
              <MessageSquare size={18} />
              Inquiries ({inquiries.length})
            </button>

            <button
              onClick={() => setActiveTab("products")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.4rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                backgroundColor:
                  activeTab === "products"
                    ? "#A63D2F"
                    : "#EAEAEA",
                color:
                  activeTab === "products"
                    ? "#FFF"
                    : "#555",
              }}
            >
              <Package size={18} />
              Product Inventory ({products.length})
            </button>
          </div>

          {activeTab === "products" ? (
            <button
              onClick={handleOpenAddProduct}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#2E7D32",
                color: "#FFF",
                border: "none",
                padding: "0.75rem 1.2rem",
                borderRadius: "6px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={18} /> Add New Brick
            </button>
          ) : (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                border: "1px solid #CCC",
                width: "300px",
                outline: "none",
              }}
            />
          )}
        </div>

        {activeTab === "quotes" && (
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F4EFEA",
                    color: "#4A2C23",
                    fontSize: "0.85rem",
                    borderBottom: "2px solid #E5DCD3",
                  }}
                >
                  <th style={{ padding: "14px" }}>Ref</th>
                  <th style={{ padding: "14px" }}>Client</th>
                  <th style={{ padding: "14px" }}>
                    Product & Quantity
                  </th>
                  <th style={{ padding: "14px" }}>Site</th>
                  <th style={{ padding: "14px" }}>Notes</th>
                  <th style={{ padding: "14px" }}>Status</th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((q) => (
                  <tr
                    key={q._id}
                    style={{
                      borderBottom: "1px solid #EEE",
                      fontSize: "0.9rem",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px",
                        fontWeight: 700,
                        color: "#A63D2F",
                      }}
                    >
                      #{q._id.slice(-6)}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <strong>{q.fullName}</strong>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        {q.phone}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        {q.email}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div>{q.productName}</div>

                      <strong
                        style={{
                          color: "#A63D2F",
                        }}
                      >
                        {Number(q.quantity).toLocaleString()} Units
                      </strong>
                    </td>

                    <td style={{ padding: "14px" }}>
                      {q.deliverySite}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        fontSize: "0.8rem",
                        color: "#555",
                        maxWidth: "250px",
                      }}
                    >
                      {q.notes || "—"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <select
                        value={q.status || "New"}
                        onChange={(e) =>
                          handleQuoteStatusChange(
                            q._id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          ...getStatusBadgeStyle(
                            q.status || "New"
                          ),
                        }}
                      >
                        {RFQ_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDeleteQuote(q._id)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#D32F2F",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F4EFEA",
                    color: "#4A2C23",
                    fontSize: "0.85rem",
                    borderBottom: "2px solid #E5DCD3",
                  }}
                >
                  <th style={{ padding: "14px" }}>Ref</th>
                  <th style={{ padding: "14px" }}>Sender</th>
                  <th style={{ padding: "14px" }}>Subject</th>
                  <th style={{ padding: "14px" }}>Message</th>
                  <th style={{ padding: "14px" }}>Status</th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {inquiries.map((i) => (
                  <tr
                    key={i._id}
                    style={{
                      borderBottom: "1px solid #EEE",
                      fontSize: "0.9rem",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px",
                        fontWeight: 700,
                        color: "#A63D2F",
                      }}
                    >
                      #{i._id.slice(-6)}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <strong>{i.name}</strong>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        {i.phone}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        {i.email}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {i.subject}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        maxWidth: "340px",
                        fontSize: "0.85rem",
                        color: "#555",
                      }}
                    >
                      {i.message}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <select
                        value={i.status || "New"}
                        onChange={(e) =>
                          handleInquiryStatusChange(
                            i._id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          ...getStatusBadgeStyle(
                            i.status || "New"
                          ),
                        }}
                      >
                        {INQUIRY_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDeleteInquiry(i._id)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#D32F2F",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F4EFEA",
                    color: "#4A2C23",
                    fontSize: "0.85rem",
                    borderBottom: "2px solid #E5DCD3",
                  }}
                >
                  <th style={{ padding: "14px" }}>
                    Product Name & Category
                  </th>
                  <th style={{ padding: "14px" }}>
                    Unit Price
                  </th>
                  <th style={{ padding: "14px" }}>MOQ</th>
                  <th style={{ padding: "14px" }}>
                    Specs (Strength / Dimensions)
                  </th>
                  <th style={{ padding: "14px" }}>
                    Availability
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: "1px solid #EEE",
                      fontSize: "0.9rem",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#222",
                        }}
                      >
                        {p.name}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#777",
                        }}
                      >
                        {p.category}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        fontWeight: 700,
                        color: "#A63D2F",
                        fontSize: "1rem",
                      }}
                    >
                      ₹{p.pricePerUnit} / unit
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        color: "#444",
                      }}
                    >
                      {Number(p.moq).toLocaleString()} units
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div>
                        <strong>Strength:</strong>{" "}
                        {p.strength}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        <strong>Size:</strong>{" "}
                        {p.dimensions}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          ...getStatusBadgeStyle(
                            p.stockStatus
                          ),
                        }}
                      >
                        {p.stockStatus}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleOpenEditProduct(p)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#1976D2",
                            cursor: "pointer",
                          }}
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteProduct(p._id)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#D32F2F",
                            cursor: "pointer",
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showProductModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              padding: "2rem",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "520px",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#4A2C23",
                  fontSize: "1.3rem",
                }}
              >
                {editingProductId
                  ? "Edit Brick Specification"
                  : "Add New Brick Specification"}
              </h2>

              <button
                onClick={() =>
                  setShowProductModal(false)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#777",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Product Name *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Modular Red Clay"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "4px",
                    border: "1px solid #CCC",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Price Per Unit (₹) *
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="9.50"
                    value={productForm.pricePerUnit}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        pricePerUnit:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    MOQ (Units)
                  </label>

                  <input
                    type="number"
                    value={productForm.moq}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        moq: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Compressive Strength *
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="15 - 20 N/mm²"
                    value={productForm.strength}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        strength:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Dimensions (mm) *
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="190 x 90 x 90 mm"
                    value={productForm.dimensions}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        dimensions:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Category
                  </label>

                  <input
                    type="text"
                    placeholder="Clay Bricks / Eco Bricks"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Stock Status
                  </label>

                  <select
                    value={productForm.stockStatus}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockStatus:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #CCC",
                    }}
                  >
                    {STOCK_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowProductModal(false)
                  }
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "4px",
                    border: "1px solid #DDD",
                    background: "#FFF",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "4px",
                    border: "none",
                    background: "#A63D2F",
                    color: "#FFF",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {editingProductId
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}