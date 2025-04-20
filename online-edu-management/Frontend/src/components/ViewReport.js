import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/view-report/');
        setReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="report-container">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8">Student Reports</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Join Course</th>
            <th className="px-4 py-2">Modules</th>
            <th className="px-4 py-2">Performance</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{report.id}</td>
              <td className="border px-4 py-2">{report.name}</td>
              <td className="border px-4 py-2">{report.join_course}</td>
              <td className="border px-4 py-2">{report.modules}</td>
              <td className="border px-4 py-2">{report.performance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewReport;
