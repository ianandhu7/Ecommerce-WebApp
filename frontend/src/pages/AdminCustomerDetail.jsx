import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserDetail } from '../services/adminApi';
import { FaArrowLeft, FaShoppingBag, FaDollarSign, FaHeart, FaChartBar } from 'react-icons/fa';

const AdminCustomerDetail = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetail();
    }, [id]);

    const fetchCustomerDetail = async () => {
        try {
            setLoading(true);
            const data = await getUserDetail(id);
            setCustomer(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer detail:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5'
            }}>
                <div>Loading customer details...</div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5',
                gap: '1rem'
            }}>
                <div>Customer not found</div>
                <Link to="/admin/customers" style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#000',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                }}>
                    Back to Customers
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F5F5',
            padding: '6rem 2rem 4rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                        to="/admin/customers"
                        style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            color: '#000',
                            textDecoration: 'none',
                            border: '1px solid #E5E5E5',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <FaArrowLeft />
                    </Link>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '300',
                        color: '#000',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>Customer Details</h1>
                </div>

                {/* Personal Info Card */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        marginBottom: '1.5rem',
                        color: '#000',
                        letterSpacing: '0.05em'
                    }}>Personal Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <InfoItem label="Name" value={customer.user.name} />
                        <InfoItem label="Email" value={customer.user.email} />
                        <InfoItem label="Phone" value={customer.user.phone || 'N/A'} />
                        <InfoItem label="Status" value={customer.user.status} />
                        <InfoItem label="Role" value={customer.user.role} />
                        <InfoItem label="Joined Date" value={new Date(customer.user.createdAt).toLocaleDateString()} />
                        <InfoItem label="Last Login" value={customer.user.lastLogin ? new Date(customer.user.lastLogin).toLocaleDateString() : 'Never'} />
                    </div>
                    {customer.user.address && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E5E5' }}>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Address</div>
                            <div style={{ fontSize: '0.875rem', color: '#000' }}>{customer.user.address}</div>
                        </div>
                    )}
                </div>

                {/* Statistics Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <StatCard
                        icon={<FaShoppingBag />}
                        title="Total Orders"
                        value={customer.statistics.totalOrders}
                        color="#000"
                    />
                    <StatCard
                        icon={<FaDollarSign />}
                        title="Total Spent"
                        value={`$${customer.statistics.totalSpent}`}
                        color="#333"
                    />
                    <StatCard
                        icon={<FaChartBar />}
                        title="Avg Order Value"
                        value={`$${customer.statistics.avgOrderValue}`}
                        color="#666"
                    />
                    <StatCard
                        icon={<FaHeart />}
                        title="Wishlist Items"
                        value={customer.statistics.wishlistItems}
                        color="#999"
                    />
                    <StatCard
                        icon={<FaShoppingBag />}
                        title="Favorite Category"
                        value={customer.statistics.mostPurchasedCategory}
                        color="#CCC"
                        isText={true}
                    />
                </div>

                {/* Order History */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        marginBottom: '1.5rem',
                        color: '#000',
                        letterSpacing: '0.05em'
                    }}>Order History</h2>
                    {customer.orderHistory.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Order ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Items</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Total</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customer.orderHistory.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000', fontWeight: '500' }}>
                                                #{order.id}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                                {order.items} items
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000', fontWeight: '600', textAlign: 'right' }}>
                                                ${parseFloat(order.total).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: order.status === 'delivered' ? '#D4EDDA' : order.status === 'cancelled' ? '#F8D7DA' : '#FFF3CD',
                                                    color: order.status === 'delivered' ? '#155724' : order.status === 'cancelled' ? '#721C24' : '#856404'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                            No orders yet
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    {/* Wishlist */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '500',
                            marginBottom: '1.5rem',
                            color: '#000',
                            letterSpacing: '0.05em'
                        }}>Wishlist ({customer.wishlist.length})</h2>
                        {customer.wishlist.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {customer.wishlist.slice(0, 5).map((item) => (
                                    <div key={item.productId} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        border: '1px solid #F5F5F5',
                                        borderRadius: '4px'
                                    }}>
                                        {item.product && (
                                            <>
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.875rem', color: '#000', fontWeight: '500', marginBottom: '0.25rem' }}>
                                                        {item.product.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: '#666', fontWeight: '600' }}>
                                                        ${item.product.price}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                No wishlist items
                            </div>
                        )}
                    </div>

                    {/* Activity Timeline */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '500',
                            marginBottom: '1.5rem',
                            color: '#000',
                            letterSpacing: '0.05em'
                        }}>Recent Activity</h2>
                        {customer.timeline.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {customer.timeline.map((event, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#000',
                                            marginTop: '0.5rem',
                                            flexShrink: 0
                                        }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.875rem', color: '#000', marginBottom: '0.25rem' }}>
                                                {event.description}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                                {new Date(event.date).toLocaleDateString()} - ${parseFloat(event.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Info Item Component
const InfoItem = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {label}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#000', fontWeight: '500' }}>
            {value}
        </div>
    </div>
);

// Stat Card Component
const StatCard = ({ icon, title, value, color, isText = false }) => (
    <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '1.5rem', color }}>{icon}</div>
            <div style={{
                fontSize: '0.75rem',
                color: '#666',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>{title}</div>
        </div>
        <div style={{
            fontSize: isText ? '1.25rem' : '2rem',
            fontWeight: isText ? '500' : '300',
            color: '#000'
        }}>{value}</div>
    </div>
);

export default AdminCustomerDetail;
