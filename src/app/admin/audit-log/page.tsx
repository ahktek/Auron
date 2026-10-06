import React from "react";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, History } from "lucide-react";

export default function AdminAuditLogPage() {
  const auditLogs = [
    { id: "log_1", action: "UPDATE", entity: "Product (ATB-24-BLK)", user: "Marcus Vance (OWNER)", ip: "192.168.1.14", timestamp: "2026-10-06 17:15:20", details: "Changed inventory from 40 to 45" },
    { id: "log_2", action: "FULFILL", entity: "Order (AUR-928103)", user: "Marcus Vance (OWNER)", ip: "192.168.1.14", timestamp: "2026-10-06 16:40:12", details: "Assigned tracking number 1Z8888888888888888" },
    { id: "log_3", action: "PUBLISH", entity: "CmsPage (home)", user: "Marcus Vance (OWNER)", ip: "192.168.1.14", timestamp: "2026-10-06 14:10:04", details: "Reordered promo tiles block to index 2" },
    { id: "log_4", action: "REFUND", entity: "Order (AUR-910244)", user: "Marcus Vance (OWNER)", ip: "192.168.1.14", timestamp: "2026-10-05 11:22:45", details: "Executed Stripe refund of $199.00 USD" },
    { id: "log_5", action: "APPROVE", entity: "Review (rev_1)", user: "Marcus Vance (OWNER)", ip: "192.168.1.14", timestamp: "2026-10-04 09:30:18", details: "Approved verified owner endorsement" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-[#FC5A43]" />
            <span>Administrative Audit Log</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Immutable tamper-evident record of all staff operations, status transitions, and data mutations.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Target Entity</th>
              <th className="py-3 px-4 font-semibold">Operator</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
              <th className="py-3 px-4 font-semibold">Details</th>
              <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/30">
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === "REFUND"
                        ? "bg-red-950 text-red-400"
                        : log.action === "UPDATE"
                        ? "bg-blue-950 text-blue-400"
                        : "bg-emerald-950 text-emerald-400"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-white">{log.entity}</td>
                <td className="py-3 px-4 text-zinc-300">{log.user}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">{log.ip}</td>
                <td className="py-3 px-4 text-zinc-400">{log.details}</td>
                <td className="py-3 px-4 text-zinc-500 text-right">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
