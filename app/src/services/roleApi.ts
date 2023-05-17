export interface roleData {
  role_id: number;
  role_name: string;
}

export async function createRole(role: {
  role_name: string;
}): Promise<roleData> {
  const url = 'http://localhost:8000/users/roles';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: roleData) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getRole(role: { role_id: number }): Promise<roleData> {
  const url = 'http://localhost:8000/users/roles' + role.role_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: roleData) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function getRoles(): Promise<roleData[]> {
  const url = 'http://localhost:8000/users/roles';
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(response => response.json())
    .then((data: roleData[]) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function updateRole(role: {
  role_id: number;
  role_name: string;
}): Promise<roleData> {
  const url = 'http://localhost:8000/users/roles/' + role.role_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: roleData) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export async function deleteRole(role: {
  role_id: number;
  role_name: string;
}): Promise<roleData> {
  const url = 'http://localhost:8000/users/roles/' + role.role_id;
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify(role),
  })
    .then(response => response.json())
    .then((data: roleData) => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}
