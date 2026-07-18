import Employee from "../models/Employee";

const PREFIX = "EMP";

export const generateEmployeeId = async (): Promise<string> => {
  const employees = await Employee.find({
    employeeId: { $regex: `^${PREFIX}\\d+$` },
  })
    .select("employeeId")
    .lean();

  let maxNumber = 0;

  for (const emp of employees) {
    const num = parseInt(emp.employeeId.replace(PREFIX, ""), 10);
    if (num > maxNumber) maxNumber = num;
  }

  return `${PREFIX}${String(maxNumber + 1).padStart(3, "0")}`;
};