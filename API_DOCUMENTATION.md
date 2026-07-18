# API Documentation

Quick reference for every endpoint in the EMS backend. I tested all of these manually through Thunder Client before wiring up the frontend, so what's written here is what actually happens, not what I planned on paper.

Base URL locally: `http://localhost:5000/api`

Every route except login needs this header:
```
Authorization: Bearer <jwt_token>
```

One thing I want to call out up front — the assignment brief suggested endpoint names like `/api/organization/tree` and `PATCH /api/employees/:id/manager`. I ended up keeping everything under one `/api/employees` resource instead (`/employees/hierarchy`, `PUT /employees/:id` for manager changes too). Felt cleaner to have one consistent base path rather than splitting employee logic across `/organization/...` and `/employees/...`. The behavior is identical either way.

---

## Auth

### `POST /auth/login`

No auth needed obviously, this is how you get the token.

Send:
```json
{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

You get back:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "employee": {
    "id": "664f1c2e5a1b2c3d4e5f6789",
    "name": "Admin",
    "email": "admin@ems.com",
    "role": "Super Admin"
  }
}
```

Wrong password or email that doesn't exist both just return the same generic error (on purpose, so you can't tell whether an email is registered):
```json
{ "success": false, "message": "Invalid email or password" }
```

There's no separate logout endpoint — since this is stateless JWT, "logging out" just means the frontend deletes the token from localStorage and clears the context. Nothing to invalidate server-side.

---

## Employees

### `POST /employees` — create

Super Admin and HR Manager can hit this. HR Manager specifically **cannot** create someone with `role: "Super Admin"` — tries to, gets a 403.

Don't send `employeeId` in the body, it's generated automatically (`EMP001`, `EMP002`, and so on, based on whatever the highest existing one is).

```json
{
  "name": "Riya Sharma",
  "email": "riya@company.com",
  "password": "Passw0rd!",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Frontend Developer",
  "salary": 60000,
  "joiningDate": "2026-01-15",
  "status": "Active",
  "role": "Employee",
  "manager": "664f1c2e5a1b2c3d4e5f6789"
}
```

201 on success with the created employee in `data`. 400 if the email's already taken.

### `GET /employees` — list, search, filter, sort, paginate

This one endpoint does all of it through query params, nothing is a separate route:

- `search` — checks name, email and employeeId (regex, case-insensitive)
- `department` — exact match, e.g. `department=Engineering`
- `status` — `Active` or `Inactive`
- `sort` — any field name, defaults to `createdAt`
- `order` — `asc` or `desc`, defaults to `desc`
- `page` / `limit` — default to `1` and `10`

So a real query looks like:
```
/employees?search=riya&department=Engineering&status=Active&sort=joiningDate&order=desc&page=1&limit=10
```

Response always has this shape, whether you passed filters or not:
```json
{
  "success": true,
  "total": 42,
  "page": 1,
  "totalPages": 5,
  "data": [ /* array of employees */ ]
}
```

### `GET /employees/:id` — one employee

Super Admin, HR Manager, or the employee looking at their own record. If a regular Employee tries someone else's `:id`, they get a 403 — not a 404, so it's not leaking whether the ID exists, just that they can't see it.

### `PUT /employees/:id` — update

This one has the most logic behind it:

- Super Admin / HR can edit any field on any employee. HR still can't set someone to `"Super Admin"` role (403 if attempted).
- If you're changing someone's `manager`, the backend walks up the new manager's reporting chain first. If it hits back to the employee being edited, it rejects with a 400 — that's the circular-reporting check (A can't end up managing someone who already, even indirectly, manages A).
- If an "Employee" is editing themselves, everything except `name`, `phone`, and `profileImage` gets dropped silently — even if you send `role` or `salary` in the body, the backend just ignores those fields for that user. It's not a UI-only restriction.

Circular check failure looks like:
```json
{
  "success": false,
  "message": "Cannot assign this manager — it would create a circular reporting relationship."
}
```

### `DELETE /employees/:id`

Super Admin only. HR Manager gets a 403 here — per the assignment spec, HR isn't supposed to delete employees, only create/edit/view.

### `GET /employees/hierarchy`

Returns the whole org chart as a tree — everyone without a manager sits at the top level, and each node has a `children` array going down. Super Admin / HR only.

```json
{
  "success": true,
  "data": [
    {
      "_id": "664f...",
      "name": "Admin",
      "designation": "System Administrator",
      "children": [
        {
          "_id": "665a...",
          "name": "Riya Sharma",
          "designation": "Frontend Developer",
          "children": []
        }
      ]
    }
  ]
}
```

---

## Dashboard

### `GET /dashboard/stats`

Super Admin / HR only. Feeds the cards and the department chart on the dashboard.

```json
{
  "success": true,
  "data": {
    "totalEmployees": 42,
    "activeEmployees": 38,
    "inactiveEmployees": 4,
    "departmentStats": [
      { "department": "Engineering", "count": 20 },
      { "department": "Sales", "count": 10 }
    ]
  }
}
```

---

## Errors, generally

Every failed request comes back the same shape, just the message and status change:
```json
{ "success": false, "message": "..." }
```

- `400` — bad input, validation failure, or an ID that isn't a valid Mongo ObjectId
- `401` — no token, or the token's invalid/expired
- `403` — you're logged in fine, your role just isn't allowed to do this
- `404` — resource doesn't exist
- `500` — something broke on my end, check server logs

---

## Employee model, for reference

| Field | Type | Notes |
|---|---|---|
| employeeId | string | auto-generated, don't send it |
| name | string | required |
| email | string | required, unique |
| password | string | required on create, hashed with bcrypt, never comes back in any response |
| phone | string | required, 10 digits |
| department | string | required |
| designation | string | required |
| salary | number | required |
| joiningDate | date | required |
| status | "Active" \| "Inactive" | defaults to Active |
| role | "Super Admin" \| "HR Manager" \| "Employee" | defaults to Employee |
| manager | ObjectId ref | optional, circular check runs when this changes |
| profileImage | string | optional |