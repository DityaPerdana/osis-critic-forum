import * as React from "react";

const roleColors = {
  admin: { bg: "bg-red-500", text: "text-white" },
  user: { bg: "bg-blue-500", text: "text-white" },
};

const RoleBadge = ({ role }: { role: keyof typeof roleColors }) => {
  const colors = roleColors[role];
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
export type { roleColors };
