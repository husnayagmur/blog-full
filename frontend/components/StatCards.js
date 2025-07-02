const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <h3 className="text-sm text-gray-600">{label}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default StatCard;
