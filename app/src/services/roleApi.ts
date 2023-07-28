export interface Role {
  roleId: number;
  roleName: string;
}

export async function createRole(role: { roleName: string }): Promise<Role> {
  const url = 'http://localhost:8000/roles';
  console.log('url');
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: Role) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getRole(role: { roleId: number }): Promise<Role> {
  const url = 'http://localhost:8000/roles' + role.roleId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: Role) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getRoles(): Promise<Role[]> {
  const url = 'http://localhost:8000/roles';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: Role[]) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function updateRole(role: {
  roleId: number;
  roleName: string;
}): Promise<Role> {
  const url = 'http://localhost:8000/roles/' + role.roleId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: Role) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function deleteRole(role: {
  roleId: number;
  roleName: string;
}): Promise<Role> {
  const url = 'http://localhost:8000/roles/' + role.roleId;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: Role) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}
