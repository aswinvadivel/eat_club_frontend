import { CheckCircle, ChevronDown, ChevronUp, Clock, Search, ShoppingBag, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { orderAPI } from '../services/api';
import { formatDateTime, formatPrice, handleApiError } from '../utils/helpers';
import '../styles/CartOrders.css';

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return <Clock size={20} style={{ color: 'var(--warning)' }} />;
    case 'CONFIRMED':
    case 'PREPARED':
    case 'DELIVERED':
      return <CheckCircle size={20} style={{ color: 'var(--primary-green)' }} />;
    case 'CANCELLED':
      return <XCircle size={20} style={{ color: 'var(--error)' }} />;
    default:
      return <ShoppingBag size={20} />;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PENDING':
      return { bg: '#fef3c7', color: '#92400e' };
    case 'CONFIRMED':
    case 'PREPARED':
      return { bg: '#dcfce7', color: '#166534' };
    case 'DELIVERED':
      return { bg: '#d1fae5', color: '#065f46' };
    case 'CANCELLED':
      return { bg: '#fee', color: '#991b1b' };
    default:
      return { bg: '#f3f4f6', color: '#374151' };
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getHistory({ page: 0, size: 50 });
        setOrders(response.data.content || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loading message="Loading your orders..." />;
  }

  const filteredOrders = orders
    .filter((order) => statusFilter === 'ALL' || order.status === statusFilter)
    .filter((order) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.trim().toLowerCase();
      const itemMatch = (order.orderItems || []).some((item) =>
        item.itemName?.toLowerCase().includes(query)
      );
      return String(order.orderId).includes(query) || itemMatch;
    });

  const orderStats = {
    totalOrders: orders.length,
    totalSpend: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    delivered: orders.filter((order) => order.status === 'DELIVERED').length,
    active: orders.filter((order) => ['PENDING', 'CONFIRMED', 'PREPARED'].includes(order.status)).length,
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const statusTabs = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <h1 style={{ marginBottom: '1rem' }}>Your Orders</h1>

        <div className="orders-stats-grid">
          <div className="orders-stat-card">
            <p>Total Orders</p>
            <h3>{orderStats.totalOrders}</h3>
          </div>
          <div className="orders-stat-card">
            <p>Total Spend</p>
            <h3>{formatPrice(orderStats.totalSpend)}</h3>
          </div>
          <div className="orders-stat-card">
            <p>Delivered</p>
            <h3>{orderStats.delivered}</h3>
          </div>
          <div className="orders-stat-card">
            <p>Active</p>
            <h3>{orderStats.active}</h3>
          </div>
        </div>

        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order id or item..."
            />
          </div>
          <div className="orders-status-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                className={`btn ${statusFilter === tab ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {filteredOrders.length > 0 ? (
          <div className="grid grid-1">
            {filteredOrders.map((order) => {
              const statusBadgeColor = getStatusBadgeColor(order.status);
              const isExpanded = !!expandedOrders[order.orderId];
              return (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--card-border)',
                    borderLeft: `4px solid var(--primary-green)`,
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>
                          Order #{order.orderId}
                        </h3>
                        <span
                          style={{
                            backgroundColor: statusBadgeColor.bg,
                            color: statusBadgeColor.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--medium-gray)', fontSize: '0.875rem' }}>
                        Placed on {formatDateTime(new Date(order.orderDate))}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ margin: 0, color: 'var(--primary-green)' }}>
                        {formatPrice(order.totalAmount)}
                      </h3>
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--medium-gray)', fontSize: '0.875rem' }}>
                        {order.orderItems?.length || 0} items
                      </p>
                      <button
                        className="btn btn-outline"
                        style={{ marginTop: '0.75rem' }}
                        onClick={() => toggleOrderExpand(order.orderId)}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--medium-gray)' }}>
                            DELIVERY ADDRESS
                          </p>
                          <p style={{ margin: 0 }}>
                            {order.deliveryAddress}
                          </p>
                        </div>

                        <div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--medium-gray)' }}>
                            PAYMENT METHOD
                          </p>
                          <p style={{ margin: 0 }}>
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {order.orderItems && order.orderItems.length > 0 && (
                        <>
                          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                          <div style={{ marginTop: '1rem' }}>
                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--medium-gray)' }}>
                              ORDER ITEMS
                            </p>
                            {order.orderItems.map((item) => (
                              <div
                                key={item.orderItemId}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginBottom: '0.5rem',
                                  fontSize: '0.875rem',
                                }}
                              >
                                <span>
                                  {item.itemName} x {item.quantity}
                                  {item.specialInstructions && (
                                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--medium-gray)', fontSize: '0.8rem' }}>
                                      Special: {item.specialInstructions}
                                    </p>
                                  )}
                                </span>
                                <span>{formatPrice(item.itemTotal)}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No orders found</h3>
            <p className="empty-state-message">
              {orders.length === 0
                ? "You haven't placed any orders. Start browsing restaurants!"
                : 'Try changing your filters or search query.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
