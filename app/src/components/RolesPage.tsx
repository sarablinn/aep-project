import React, { useState, useEffect } from 'react';
import {
  createRole,
  getRole,
  getRoles,
  updateRole,
  deleteRole,
} from './../services/roleApi';
import Loading from './../utilities/Loading';
import Error from './../utilities/Error';
import { selectedRole } from './../services/Atoms';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';

const RolesPage = () => {
  const [role_name, setRoleName] = useState('');
  const [role, setRole] = useAtom(selectedRole);

  const changeRoleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(event.target.value);
  };

  // a HOOK
  const { data, mutate } = useMutation({
    mutationFn: () =>
      createRole({
        role_name: role_name,
      }),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('COMPLETE: role created.'),
  });

  const deleteRole = useMutation({
    mutationFn: () =>
      deleteRole({
        role_id: role.role_id,
        role_name: role_name,
      }),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('COMPLETE: role deleted.'),
  });

  const {
    isLoading: rolesAreLoading,
    error: rolesError,
    data: rolesData,
    // refetch: usersRefetch,
  } = useQuery({
    queryKey: [`roles`],
    queryFn: () => getRoles(),
  });

  useEffect(() => {
    return () => {
      // TODO fix refetch.then()
      // usersRefetch().then();
    };
  }, [data]);

  if (rolesAreLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (rolesError) return <Error />;

  if (rolesData) {
    return (
      <div className="m-3 p-3">
        <div>Selected Role: {role.role_name}</div>
        {rolesData.map((role, index) => (
          <div key={index} className="border">
            <div>Role id: {role.role_id}</div>
            <div>Role Name: {role.role_name}</div>
            <button className="bg-red-700" onClick={() => setRole(role)}>
              Select Role
            </button>
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default RolesPage;
