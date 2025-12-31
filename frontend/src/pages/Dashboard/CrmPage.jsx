import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ListBulletIcon,
  ClockIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";

// --- Utility: Status Badge Component (Bitrix-style colors) ---
const StatusBadge = ({ status }) => {
  let colorClass;
  let dotClass;
  switch (status) {
    case "New":
    case "Pending":
      colorClass = "bg-[#E6F3FF] text-[#0074e0]"; // Light Blue/Bitrix Blue
      dotClass = "bg-[#0074e0]";
      break;
    case "In Progress":
    case "Assigned":
      colorClass = "bg-[#FFF8E6] text-[#FFA900]"; // Light Yellow/Orange
      dotClass = "bg-[#FFA900]";
      break;
    case "Completed":
    case "Won":
      colorClass = "bg-[#E6F8E6] text-[#00A859]"; // Light Green
      dotClass = "bg-[#00A859]";
      break;
    case "Dead":
    case "Lost":
      colorClass = "bg-[#FFF0F0] text-[#FF453A]"; // Light Red
      dotClass = "bg-[#FF453A]";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-700";
      dotClass = "bg-gray-500";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${colorClass}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1 ${dotClass}`}></span>
      {status}
    </span>
  );
};

// --- DATA STRUCTURES (Retained from previous) ---
const leadData = [
  {
    id: 1,
    name: "Alice Smith",
    source: "Website",
    service: "GST Registration",
    status: "New",
    assigned: "Employee A",
  },
  {
    id: 2,
    name: "Bob Johnson",
    source: "Referral",
    service: "Trademark Filing",
    status: "In Progress",
    assigned: "Employee B",
  },
  {
    id: 3,
    name: "Charlie Brown",
    source: "Email Campaign",
    service: "Company Closure",
    status: "Dead",
    assigned: "Employee A",
  },
  {
    id: 4,
    name: "Diana Prince",
    source: "Website",
    service: "PF/ESI Registration",
    status: "New",
    assigned: "Employee C",
  },
];

const taskData = [
  {
    id: 101,
    title: "Follow up with Alice Smith",
    status: "Pending",
    dueDate: "2025-10-16",
    assignedTo: "Employee A",
  },
  {
    id: 102,
    title: "Draft Trademark application for Bob",
    status: "In Progress",
    dueDate: "2025-10-20",
    assignedTo: "Employee B",
  },
  {
    id: 103,
    title: "Prepare quarterly sales report",
    status: "Completed",
    dueDate: "2025-10-10",
    assignedTo: "Manager",
  },
];

const orderData = [
  {
    id: 1001,
    client: "Alice Smith",
    service: "GST Registration",
    value: 499,
    status: "Pending",
  },
  {
    id: 1002,
    client: "Acme Corp",
    service: "Annual Compliance",
    value: 14999,
    status: "Won",
  },
  {
    id: 1003,
    client: "Luna Biz",
    service: "Import Export Code",
    value: 999,
    status: "Lost",
  },
];

const stats = [
  {
    name: "New Leads",
    value: leadData.filter((l) => l.status === "New").length,
    icon: UserPlusIcon,
    color: "text-[#0074e0]",
    bgColor: "bg-white",
    border: "border-[#0074e0]",
  },
  {
    name: "Pending Tasks",
    value: taskData.filter((t) => t.status === "Pending").length,
    icon: ClockIcon,
    color: "text-[#FF453A]",
    bgColor: "bg-white",
    border: "border-[#FF453A]",
  },
  {
    name: "Total Orders",
    value: orderData.length,
    icon: FolderOpenIcon,
    color: "text-[#00A859]",
    bgColor: "bg-white",
    border: "border-[#00A859]",
  },
  {
    name: "Revenue Won (Sample)",
    value: "₹15,498",
    icon: CurrencyRupeeIcon,
    color: "text-[#00A859]",
    bgColor: "bg-white",
    border: "border-[#00A859]",
  },
];

// --- 3. Main CRM Dashboard Component (Bitrix24 Design) ---
export default function CrmPage() {
  return (
    <div className="font-sans antialiased p-4 sm:p-6 lg:p-8 space-y-8 bg-[#F5F7F9]">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow p-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CRM Dashboard</h1>
        <Link
          to="/crm/leads/add"
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#0074e0] text-white font-medium rounded-lg shadow-md hover:bg-[#005bb5] transition duration-150 text-sm"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" /> Add New Client/Lead
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`p-5 rounded-xl shadow-lg ${stat.bgColor} border-l-4 ${stat.border} transition duration-150 hover:shadow-xl`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {stat.name}
              </h3>
              <stat.icon className={`w-6 h-6 ${stat.color} opacity-70`} />
            </div>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ProcessTimeline orderId={1002} />

      <div className="space-y-6">
        <LeadsTable />
        <TasksTable />
        <OrdersTable />
      </div>
    </div>
  );
}

const PIPELINE_STEPS = [
  { key: "WEB", label: "Web/App" },
  { key: "CRM", label: "CRM" },
  { key: "SALES", label: "Sales" },
  { key: "ONBD", label: "Onboarding" },
  { key: "CASE", label: "Case" },
  { key: "EXEC", label: "Execution" },
  { key: "GOVT", label: "Govt" },
  { key: "QA", label: "QA" },
  { key: "DEL", label: "Delivery" },
];

function ProcessTimeline({ orderId }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    let mounted = true;
    axios
      .get(`/api/process/orders/${orderId}`)
      .then((r) => mounted && setEvents(Array.isArray(r.data) ? r.data : []))
      .catch(() => mounted && setEvents([]));
    return () => (mounted = false);
  }, [orderId]);

  const done = new Set(
    events
      .filter((e) => (e.status || "").toLowerCase() === "completed")
      .map((e) => e.stage),
  );
  const failed = new Set(
    events
      .filter((e) => (e.status || "").toLowerCase() === "failed")
      .map((e) => e.stage),
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#0074e0]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-xl font-bold text-gray-800">
          End-to-End Process Timeline
        </h2>
        <span className="text-sm text-gray-500">Order #{orderId}</span>
      </div>

      <div className="relative">
        {/* Desktop Horizontal Line */}
        <div className="hidden lg:block absolute top-1/2 left-2 right-2 h-1 bg-gray-200 -translate-y-1/2" />

        {/* Mobile Vertical Line */}
        <div className="lg:hidden absolute top-2 bottom-2 left-[19px] w-1 bg-gray-200" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
          {PIPELINE_STEPS.map((step, idx) => {
            const isDone = done.has(step.key);
            const isFail = failed.has(step.key);
            const color = isFail
              ? "bg-red-500"
              : isDone
                ? "bg-emerald-500"
                : "bg-gray-300";
            const ring = isFail
              ? "ring-2 ring-red-300"
              : isDone
                ? "ring-2 ring-emerald-300"
                : "ring-2 ring-gray-200";
            return (
              <div
                key={step.key}
                className="flex lg:flex-col items-center text-left lg:text-center gap-4 lg:gap-0 w-full lg:w-auto"
              >
                <div className={`w-10 h-10 lg:w-5 lg:h-5 rounded-full ${color} ${ring} flex-shrink-0 z-10`} />
                <div className="mt-0 lg:mt-2 text-sm lg:text-xs font-medium text-gray-700 whitespace-nowrap">
                  {idx + 1}. {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!!events.length && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Recent Events
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {events.map((e) => (
              <li key={e.id} className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="font-semibold text-gray-800">{e.stage}</span> — <span className={e.status === 'Completed' ? 'text-green-600' : 'text-gray-600'}>{e.status}</span>
                {e.notes ? ` • ${e.notes}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Component: Leads Table (Redesigned) ---
const LeadsTable = () => (
  <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#0074e0]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">Client Leads Pipeline</h2>
      <Link
        to="/crm/leads"
        className="text-sm font-medium text-[#0074e0] hover:text-[#005bb5]"
      >
        View All Leads &gt;
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#F9FAFB]">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Client Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Service Interest
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Assigned To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Stage
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {leadData.map((lead) => (
            <tr
              key={lead.id}
              className="hover:bg-gray-50 transition duration-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {lead.service}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {lead.assigned}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/crm/leads/${lead.id}`}
                  className="text-[#0074e0] hover:text-[#005bb5]"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Component: Tasks Table (Redesigned) ---
const TasksTable = () => (
  <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#FFA900]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">
        Employee Task Assignments
      </h2>
      <Link
        to="/crm/tasks"
        className="text-sm font-medium text-[#FFA900] hover:text-[#cc8600]"
      >
        View All Tasks &gt;
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#F9FAFB]">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Task Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Assigned To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {taskData.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-50 transition duration-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {task.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {task.dueDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {task.assignedTo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/crm/tasks/${task.id}`}
                  className="text-[#FFA900] hover:text-[#cc8600]"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Component: Orders Table (Redesigned) ---
const OrdersTable = () => (
  <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#00A859]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">
        Order/Sales Management
      </h2>
      <Link
        to="/crm/orders"
        className="text-sm font-medium text-[#00A859] hover:text-[#008945]"
      >
        View Full Pipeline &gt;
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#F9FAFB]">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Order ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Value
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {orderData.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition duration-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {order.client}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {order.service}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                ₹{order.value.toLocaleString("en-IN")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
