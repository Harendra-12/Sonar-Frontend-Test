# Ring Group Module Documentation

## Overview

A **Ring Group** is a collection of extensions that receive incoming calls based on a set strategy. When a call reaches the group, all members are notified accordingly.

---

## Ring Group Listing Page

### Fetching Ring Group Data

- API: `/ringgroup/dashboard?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
- Uses **useEffect** to update data when:
  - Search value changes
  - Page number changes
  - Row per page value changes
- Refreshes **user listing state** to ensure up-to-date information.

### Validating Ring Group Creation

- `handleRingGroupAddValidation`:
  - Ensures users exist before allowing group creation.
  - Restricts access if no users are available.
  - Checks **user permissions**.

### Deleting a Ring Group

- `handleDelete`: Calls `/ringgroup/${id}` to delete a ring group.
- Refreshes **global ring group state** after deletion.

### Updating Ring Group Status

- `handleUpdateStatusRingGroup`: Enables or disables a ring group.

### Summary

- **Real-time search, pagination, and filtering**
- **Automatic updates on user actions**
- **Direct deletion of ring groups**
- **Enable/disable toggle from the listing page**

---

## Ring Group Add Page

### Managing Form Data

- Uses **useForm** for validation with default values.
- Displays a message if no users exist.
- Fetches **ringback music** and allows adding music directly.

### Fetching Users & Extensions

- Retrieves users with valid extensions.
- Triggers an API call via **Redux refresh** if data is missing.

### Adding & Managing Agents

- **Adding Agents**:
  - Individual or bulk selection via a popup.
  - Bulk selection allows selecting multiple agents at once.
- **Removing Agents**:
  - `deleteDestination`: Removes selected agents.
- **Validating Agents**:
  - `validateAgents`: Ensures only valid agents are added.
  - `validateUniqueAgents`: Prevents duplicate entries.
- **Handling Agent List Updates**:
  - `handleDestinationChange`: Updates displayed agents.
  - `handleCheckboxChange`: Monitors agent selection (add/remove).
  - `handleBulkDestinationUpload`: Allows bulk addition of agents.
  - `handleSelectAll`: Selects or deselects all available agents.
- **Searching & Filtering Agents**:
  - `handleSearchChange`: Filters agents dynamically.
  - `filteredUsers`: Displays searched agents first.
  - `availableUsers`: Checks users with assigned extensions.
- **Editing Agent Settings**:
  - `handleSelectUserToEdit`: Selects an agent for modification.
  - `handleApplyEditSettings`: Applies bulk changes.

### Managing Music

- **Adding Music**:
  - `handleAddMusic`: Allows adding ringback music from the current page.

### Submitting Form

- `handleFormSubmit`:
  - Validates all fields.
  - Sends a **POST request** to `/ringgroup/store`.
  - Navigates to **Ring Group Listing Page** on success.

### Summary

- **User & extension validation before creation**
- **Bulk agent addition & modifications**
- **Duplicate prevention & real-time search**
- **Ringback music management**
- **Seamless submission & navigation**

---

## Ring Group Edit Page

### Fetching Ring Group Data

- API: `/ringgroup/${value}`
- Extracts **ID (****`value`****)** from query parameters.
- Uses **useEffect** to fetch and update the **local state**.

### Editing Ring Group

- Uses the same logic as **Ring Group Add Page**, but pre-fills existing data.
- Updates settings, agents, and music as needed.
- **Submitting Changes**:
  - `handleFormSubmit`: Sends a **PUT request** to `/ringgroup/${value}`.
  - Navigates back to the **Ring Group Listing Page** after success.

### Summary

- **Fetching and modifying existing ring group data**
- **Managing agents through manual or bulk selection**
- **Ensuring valid and unique agents are assigned**
- **Adding and updating ringback music**
- **Handling real-time search and selection**
- **Submitting changes via a PUT request**

