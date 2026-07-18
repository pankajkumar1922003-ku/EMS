import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import HierarchyTreeNode from "../components/employees/HierarchyTreeNode";
import { getOrganizationHierarchy } from "../services/hierarchyService";
import type { HierarchyNode } from "../types/employee";

const OrganizationHierarchy = () => {
  const [tree, setTree] = useState<HierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const response = await getOrganizationHierarchy();
        setTree(response.data.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load hierarchy"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Organization Hierarchy</h1>

      <div className="rounded-xl bg-white p-6 shadow">
        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading...</p>
        ) : tree.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No hierarchy data found
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {tree.map((node) => (
              <HierarchyTreeNode key={node._id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationHierarchy;