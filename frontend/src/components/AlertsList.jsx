import React from "react";

const severityColor = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function AlertsList({ alerts }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚨 Security Alerts</h2>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Top */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">
                {alert.type}
              </span>

              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${severityColor[alert.severity]}`}
              >
                {alert.severity.toUpperCase()}
              </span>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-2">{alert.message}</p>

            {/* Info */}
            <div className="text-sm text-gray-500 flex flex-wrap gap-4">
              {alert.ip && <span>🌐 IP: {alert.ip}</span>}
              {alert.user_id && <span>👤 User: {alert.user_id}</span>}
              <span>⏱ {new Date(alert.created_at).toLocaleString()}</span>
            </div>

            {/* Context */}
            {alert.context && (
              <pre className="mt-3 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(alert.context, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}