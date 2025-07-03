import React from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  FaRegFileAlt,
  FaUsers,
  FaTags,
  FaFolderOpen,
  FaComments,
  FaHeart,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const blogStats = [
  { day: "Pzt", blogs: 8 },
  { day: "Sal", blogs: 12 },
  { day: "Çar", blogs: 10 },
  { day: "Per", blogs: 15 },
  { day: "Cum", blogs: 7 },
  { day: "Cmt", blogs: 6 },
  { day: "Paz", blogs: 9 },
];

const mostCommentedBlogs = [
  { id: 1, title: "Modern React ile Tasarım", comments: 28 },
  { id: 2, title: "Node.js ve Express Rehberi", comments: 24 },
  { id: 3, title: "MongoDB ile Veri Yönetimi", comments: 20 },
];

const recentUsers = [
  { id: 1, name: "Ayşe Yılmaz", email: "ayse@example.com" },
  { id: 2, name: "Mehmet Demir", email: "mehmet@example.com" },
  { id: 3, name: "Fatma Çelik", email: "fatma@example.com" },
];

const stats = [
  { title: "Bloglar", count: 128, icon: <FaRegFileAlt size={28} />, color: "#8C7A64" },
  { title: "Kullanıcılar", count: 54, icon: <FaUsers size={28} />, color: "#555936" },
  { title: "Kategoriler", count: 12, icon: <FaFolderOpen size={28} />, color: "#8C7A64" },
  { title: "Etiketler", count: 30, icon: <FaTags size={28} />, color: "#555936" },
  { title: "Yorumlar", count: 85, icon: <FaComments size={28} />, color: "#8C7A64" },
  { title: "Beğeniler", count: 240, icon: <FaHeart size={28} />, color: "#555936" },
];

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold mb-10 text-[#555936] tracking-tight">
          Yönetim Paneli Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {stats.map(({ title, count, icon, color }) => (
            <div
              key={title}
              className="flex items-center p-6 rounded-xl shadow-md bg-gray-100 text-gray-800 transition-transform transform hover:scale-105 cursor-default"
              style={{
                borderLeft: `6px solid ${color}`,
                backgroundColor: '#f0f6f4',
              }}
            >
              <div
                className="flex-shrink-0 mr-6"
                style={{ color, fontSize: '2.5rem' }}
                aria-label={`${title} ikonu`}
              >
                {icon}
              </div>
              <div>
                <p className="text-4xl font-bold">{count}</p>
                <p className="uppercase text-sm tracking-wide mt-1">{title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#555936] border-b-2 border-[#8C7A64] pb-2">
              Haftalık Blog Oluşturma
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={blogStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0d1" />
                <XAxis dataKey="day" stroke="#555936" />
                <YAxis stroke="#555936" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9f9f0", borderRadius: 8, border: "none" }}
                  itemStyle={{ color: "#555936", fontWeight: "600" }}
                />
                <Line
                  type="monotone"
                  dataKey="blogs"
                  stroke="#8C7A64"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
          <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold mb-6 text-[#555936] border-b-2 border-[#8C7A64] pb-2">
              En Çok Yorum Alan Bloglar
            </h2>
            <ul className="flex flex-col space-y-4 overflow-y-auto max-h-[280px]">
              {mostCommentedBlogs.map(({ id, title, comments }) => (
                <li
                  key={id}
                  className="flex items-center justify-between border-b border-gray-200 pb-3"
                >
                  <p className="font-medium text-gray-800">{title}</p>
                  <div className="flex items-center text-[#8C7A64] font-semibold">
                    <FaComments className="mr-2" />
                    <span>{comments}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold mb-6 text-[#555936] border-b-2 border-[#8C7A64] pb-2">
              Son Eklenen Kullanıcılar
            </h2>
            <ul className="flex flex-col space-y-4 overflow-y-auto max-h-[280px]">
              {recentUsers.map(({ id, name, email }) => (
                <li
                  key={id}
                  className="flex flex-col border-b border-gray-200 pb-3"
                >
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
