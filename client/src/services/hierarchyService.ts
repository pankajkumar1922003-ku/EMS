import api from "./api";

export const getOrganizationHierarchy = () => api.get("/employees/hierarchy");