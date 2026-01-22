import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUsersGrowth, getTopCustomers, getCategoryStats, getUsersSummary } from '../services/adminApi';
import { FaUsers, FaUserPlus, FaUserCheck, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
    const [usersGrowth, setUsersGrowth] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [usersSummary, setUsersSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsers: 0,
        activeUsers: 0,
        returningUsers: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [growth, customers, categories, summary] = await Promise.all([
                getUsersGrowth(),
                getTopCustomers(5),
                getCategoryStats(),
                getUsersSummary()
            ]);

            setUsersGrowth(growth.map(g => ({
                month: g.month,
                users: parseInt(g.count)
            })));
            setTopCustomers(customers);
            setCategoryStats(categories);
            setUsersSummary(summary);

            // Calculate stats
            const totalUsers = summary.length;
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const newUsers = summary.filter(u => new Date(u.joinedDate) >= lastMonth).length;
            const activeToday = summary.filter(u => {
                const lastLogin = new Date(u.lastLogin);
                return lastLogin >= today;
            }).length;
            const returningUsers = summary.filter(u => u.totalOrders > 1).length;

            setStats({
                totalUsers,
                newUsers,
                activeUsers: activeToday,
                returningUsers
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '0.875rem',
                        color: '#666',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>Loading dashboard...</div>
                </div>
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
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '300',
                        color: '#000',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>Admin Dashboard</h1>
                    <Link
                        to="/admin/customers"
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#000',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                    >
                        View All Customers
                    </Link>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    <StatCard
                        icon={<FaUsers />}
                        title="Total Users"
                        value={stats.totalUsers}
                        color="#000"
                    />
                    <StatCard
                        icon={<FaUserPlus />}
                        title="New Users (Last Month)"
                        value={stats.newUsers}
                        color="#333"
                    />
                    <StatCard
                        icon={<FaUserCheck />}
                        title="Active Today"
                        value={stats.activeUsers}
                        color="#666"
                    />
                    <StatCard
                        icon={<FaChartLine />}
                        title="Returning Customers"
                        value={stats.returningUsers}
                        color="#999"
                    />
                </div>

                {/* Charts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* User Growth Chart */}
                    <ChartCard title="Monthly User Growth">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={usersGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                                <XAxis dataKey="month" stroke="#666" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#666" style={{ fontSize: '0.75rem' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#000" strokeWidth={2} name="New Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Top Customers Chart */}
                    <ChartCard title="Top 5 Customers">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topCustomers}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                                <XAxis dataKey="name" stroke="#666" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#666" style={{ fontSize: '0.75rem' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalSpent" fill="#000" name="Total Spent ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Category Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem'
                }}>
                    {/* Category Table */}
                    <ChartCard title="Most Purchased Categories">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Category</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Items Sold</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryStats.map((cat, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000' }}>{cat.category}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: '#000' }}>{cat.count}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: '#000', fontWeight: '500' }}>${cat.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartCard>

                    {/* Category Pie Chart */}
                    <ChartCard title="Category Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
    <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem', color }}>{icon}</div>
            <div style={{
                fontSize: '0.875rem',
                color: '#666',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>{title}</div>
        </div>
        <div style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            color: '#000'
        }}>{value}</div>
    </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
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
        }}>{title}</h2>
        {children}
    </div>
);

export default AdminDashboard;
