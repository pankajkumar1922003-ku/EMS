import { useState } from "react";
import type { HierarchyNode } from "../../types/employee";

const HierarchyTreeNode = ({ node }: { node: HierarchyNode }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-2">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 text-gray-500 hover:text-gray-800"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div>
          <p className="font-semibold text-slate-900">{node.name}</p>
          <p className="text-xs text-gray-500">
            {node.designation} · {node.department}
          </p>
        </div>

        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
            node.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {node.status}
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="ml-6 mt-2 flex flex-col gap-2 border-l-2 border-gray-200 pl-4">
          {node.children.map((child) => (
            <HierarchyTreeNode key={child._id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchyTreeNode;