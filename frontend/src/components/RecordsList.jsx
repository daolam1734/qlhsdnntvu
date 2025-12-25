import { useEffect, useState } from 'react';
import api from '../utils/api';

const RecordsList = ({ user }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/records');
        setRecords(response.data);
      } catch (error) {
        alert('Failed to fetch records');
      }
    };
    fetchRecords();
  }, []);

  const canApprove = user.role === 'party' || user.role === 'admin';

  const handleApprove = async (id) => {
    try {
      await api.put(`/records/${id}`, { status: 'approved' });
      setRecords(records.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } catch (error) {
      alert('Failed to approve');
    }
  };

  return (
    <div>
      <h2>Records</h2>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            {record.title} - {record.status}
            {canApprove && record.status === 'pending' && (
              <button onClick={() => handleApprove(record.id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordsList;