export const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(header => {
            let value = row[header];
            // Handle strings that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
                value = `"${value}"`;
            }
            // Handle null/undefined
            if (value === null || value === undefined) {
                value = '';
            }
            return value;
        }).join(',')) // Data rows
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Create download URL
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
