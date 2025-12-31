import React, { useState, useEffect } from 'react';
// Ensure leadAPI is exported from this path
import { adminAPI } from '../lib/api';
import './LeadsPage.css';

const LeadsPage = () => {
    // Initialize leads as an empty array to avoid map errors before data loads
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Flag to prevent state updates if component unmounts during API call
        let isMounted = true;

        const fetchLeads = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use the corrected API call
                const response = await adminAPI.listLeads();

                if (isMounted) {
                    // Ensure we are getting an array, fallback to empty array if data is null/undefined
                    setLeads(response.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching leads:", err);
                    // You might want to check err.response for specific API error messages here
                    setError('Failed to fetch leads. Please try again later.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLeads();

        // Cleanup function runs when component unmounts
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="leads-container leads-loading">Loading leads...</div>;
    }

    if (error) {
        return <div className="leads-container leads-error">{error}</div>;
    }

    return (
        <div className="leads-container">
            <h1>Manage Leads</h1>
            {!leads || leads.length === 0 ? (
                <p className="no-leads-message">No leads found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                {/* Added scope="col" for better accessibility */}
                                <th scope="col">Full Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                // Ensure lead.id is a unique identifier from your database
                                <tr key={lead.id}>
                                    {/* Assuming these property names match your API response structure */}
                                    <td>{lead.fullName}</td>
                                    <td>{lead.email}</td>
                                    {/* Use || 'N/A' for fallback if the field is null or empty string */}
                                    <td>{lead.phone || <span className="text-muted">N/A</span>}</td>
                                    <td>{lead.address || <span className="text-muted">N/A</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeadsPage;