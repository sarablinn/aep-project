import { useAuth0 } from '@auth0/auth0-react';
import { ThreeDots } from 'react-loader-spinner';
import { PhotoshopPicker } from 'react-color';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserByToken } from '../services/userApi';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated, error } = useAuth0();

  const [bgColor, setBackgroundColor] = useState('FFFFFF');
  const [fgColor, setForegroundColor] = useState('000000');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userToken, setUserToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [roleId, setRoleId] = useState(1);

  const handleBackgroundChangeComplete = (event: any) => {
    setBackgroundColor(event.hex);
  };
  const handleForegroundChangeComplete = (event: any) => {
    setForegroundColor(event.hex);
  };

  const { data: userResource, mutate: getUserByTokenMutation } = useMutation({
    mutationFn: (userToken: string) => getUserByToken(userToken),
    onMutate: () => console.log('mutate'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSettled: () => console.log('getUserByTokenMutation Settled.'),
  });

  useEffect(() => {
    if (isAuthenticated && user.sub != null) {
      getUserByTokenMutation(user.sub);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div>
        <ThreeDots height="30" width="30" color="white" ariaLabel="loading" />
      </div>
    );
  }
  if (error) {
    return <div>ERROR: {error.message}</div>;
  }
  if (isAuthenticated) {
    return (
      <div className="container m-3 p-3">
        <p>User id: {user?.sub}</p>
        <p>Email: {user?.email}</p>
        <p>Username: {user?.username}</p>
        <p>First Name: {user?.given_name}</p>
        <p>Last Name: {user?.family_name}</p>
        <p>{JSON.stringify(user, null, 2)}</p>

        <div className="flex">
          <PhotoshopPicker
            className="user-profile-sketchpicker m-3 p-3"
            header="Background Color"
            color={userResource?.backgroundColor}
            onAccept={handleBackgroundChangeComplete}
            onChangeComplete={handleBackgroundChangeComplete}
          />
          <PhotoshopPicker
            className="user-profile-sketchpicker m-3 p-3"
            header="Foreground Color"
            color={userResource?.foregroundColor}
            onAccept={handleForegroundChangeComplete}
            onChangeComplete={handleForegroundChangeComplete}
          />
        </div>
        <div className="w-25 h-25 m-3 p-3" style={{ backgroundColor: bgColor }}>
          Preview
        </div>
      </div>
    );
  }
};

export default UserProfile;
