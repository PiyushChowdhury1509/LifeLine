import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const DashboardContent = () => {
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Accidents',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Response Time',
        data: [3, 2, 2, 3, 5, 4, 4],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col p-6 space-y-6 w-full">
      {/* Volunteer Stats */}
      <div className="flex space-x-6">
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white">Total Accidents</h3>
          <p className="text-4xl text-white">120</p>
        </div>
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white">Average Response Time</h3>
          <p className="text-4xl text-white">4 min</p>
        </div>
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white">Volunteers Active</h3>
          <p className="text-4xl text-white">35</p>
        </div>
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white">Accidents Resolved</h3>
          <p className="text-4xl text-white">98</p>
        </div>
      </div>

      {/* Charts */}
      <div className="flex space-x-6">
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white mb-6">Accidents Per Month</h3>
          <Bar data={barData} />
        </div>
        <div className="flex-1 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-white mb-6">Response Time Trend</h3>
          <Line data={lineData} />
        </div>
      </div>

      {/* Accident Reports Table */}
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-white mb-6">Accident Response History</h3>
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-6 py-4 text-white">Date</th>
              <th className="px-6 py-4 text-white">Location</th>
              <th className="px-6 py-4 text-white">Description</th>
              <th className="px-6 py-4 text-white">Status</th>
              <th className="px-6 py-4 text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="border px-6 py-4 text-white">2023-09-01</td>
                <td className="border px-6 py-4 text-white">New York</td>
                <td className="border px-6 py-4 text-white">Minor Collision</td>
                <td className="border px-6 py-4 text-white">Resolved</td>
                <td className="border px-6 py-4">
                  <button className="text-blue-400">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;
