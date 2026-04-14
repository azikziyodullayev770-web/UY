import { motion } from "motion/react";
import { Users, Home, TrendingUp, Settings, LogOut, FileText, CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

export function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const stats = [
    { title: "Total Users", value: "2,451", icon: Users, color: "text-blue-400" },
    { title: "Active Properties", value: "843", icon: Home, color: "text-green-400" },
    { title: "Revenue (MTD)", value: "$45.2k", icon: TrendingUp, color: "text-purple-400" },
  ];

  const pendingApprovals = [
    { id: 1, title: "Luxury Villa", location: "Tashkent", price: "$425,000", status: "pending" },
    { id: 2, title: "Modern Apartment", location: "Samarkand", price: "$120,000", status: "pending" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#0B1D3A] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-red-400/80">System Administration</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center rounded-full bg-red-500/10 p-3 text-red-500 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        {/* Stats Grid */}
        <section>
          <h2 className="mb-4 text-sm font-medium text-white/60">Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <GlassCard key={i} className={i === 2 ? "col-span-2" : ""}>
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.title}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Pending Approvals */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/60">Pending Approvals</h2>
            <button className="text-xs text-[#00D4FF] hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-500/10 p-2">
                      <FileText className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-white/50">{item.location} • {item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-full bg-green-500/10 p-2 transition-colors hover:bg-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </button>
                    <button className="rounded-full bg-red-500/10 p-2 transition-colors hover:bg-red-500/20">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* System Settings Link */}
        <section>
          <GlassCard className="border-white/10 bg-white/5 transition-colors hover:bg-white/10 cursor-pointer">
            <div className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">System Settings</p>
                <p className="text-xs text-white/50">Manage application configuration</p>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
