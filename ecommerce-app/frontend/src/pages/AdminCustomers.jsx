import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsersSummary, deleteUser, updateUserStatus } from '../services/adminApi';
import { FaSearch, FaEye, FaTrash, FaSort } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'totalSpent', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        // Filter and sort customers
        let filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.favoriteCategory.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Convert to numbers for numeric fields
            if (sortConfig.key === 'totalSpent' || sortConfig.key === 'totalOrders') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }

            if (sortConfig.key === 'lastLogin' || sortConfig.key === 'joinedDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredCustomers(sorted);
        setCurrentPage(1); // Reset to first page when filtering/sorting
    }, [customers, searchTerm, sortConfig]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getUsersSummary();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to load customers');
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleDelete = async (customerId, customerName) => {
        if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
            try {
                await deleteUser(customerId);
                toast.success('Customer deleted successfully');
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Failed to delete customer');
            }
        }
    };

    const handleStatusChange = async (customerId, newStatus) => {
        try {
            await updateUserStatus(customerId, newStatus);
            toast.success('Status updated successfully');
            fetchCustomers();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5'
            }}>
                <div>Loading customers...</div>
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
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '300',
                        color: '#000',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '2rem'
                    }}>Customer Management</h1>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    border: '1px solid #E5E5E5',
                                    backgroundColor: 'white',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <Link
                            to="/admin/dashboard"
                            style={{
                                padding: '0.875rem 2rem',
                                backgroundColor: 'white',
                                color: '#000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                border: '1px solid #000',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E5E5' }}>
                                <tr>
                                    <SortableHeader title="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableHeader title="Email" sortKey="email" sortConfig={sortConfig} onSort={handleSort} />
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Role</th>
                                    <SortableHeader title="Total Spent" sortKey="totalSpent" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableHeader title="Orders" sortKey="totalOrders" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableHeader title="Favorite Category" sortKey="favoriteCategory" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableHeader title="Last Login" sortKey="lastLogin" sortConfig={sortConfig} onSort={handleSort} />
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((customer) => (
                                    <tr key={customer.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000', fontWeight: '500' }}>
                                            {customer.name}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                            {customer.email}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                            {customer.role}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000', fontWeight: '600' }}>
                                            ${customer.totalSpent}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#000', textAlign: 'center' }}>
                                            {customer.totalOrders}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                            {customer.favoriteCategory}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666' }}>
                                            {new Date(customer.lastLogin).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={customer.status}
                                                onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                                style={{
                                                    padding: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    border: '1px solid #E5E5E5',
                                                    borderRadius: '4px',
                                                    backgroundColor: customer.status === 'active' ? '#D4EDDA' : customer.status === 'suspended' ? '#F8D7DA' : '#FFF3CD',
                                                    color: customer.status === 'active' ? '#155724' : customer.status === 'suspended' ? '#721C24' : '#856404',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <Link
                                                    to={`/admin/customer/${customer.id}`}
                                                    style={{
                                                        padding: '0.5rem',
                                                        backgroundColor: '#000',
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        borderRadius: '4px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id, customer.name)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        backgroundColor: '#DC3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Delete Customer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            padding: '1.5rem',
                            borderTop: '1px solid #E5E5E5',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: currentPage === 1 ? '#F5F5F5' : '#000',
                                    color: currentPage === 1 ? '#999' : 'white',
                                    border: 'none',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Previous
                            </button>
                            <span style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: currentPage === totalPages ? '#F5F5F5' : '#000',
                                    color: currentPage === totalPages ? '#999' : 'white',
                                    border: 'none',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#666'
                }}>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
                </div>
            </div>
        </div>
    );
};

// Sortable Header Component
const SortableHeader = ({ title, sortKey, sortConfig, onSort }) => (
    <th
        onClick={() => onSort(sortKey)}
        style={{
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            userSelect: 'none'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {title}
            {sortConfig.key === sortKey && (
                <FaSort style={{ fontSize: '0.75rem', color: sortConfig.direction === 'asc' ? '#000' : '#666' }} />
            )}
        </div>
    </th>
);

export default AdminCustomers;
