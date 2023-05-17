import { useQuery } from '@tanstack/react-query';
// import Loading from './../utilities/Loading';
// import Error from './../utilities/Error';
import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';
import { getUsers } from './../services/userApi';

const Homepage = () => {
  const [user] = useAtom(selectedUser);

  //makes the call for the users, caches, and makes it available for the users page
  useQuery({
    queryKey: [`users`],
    queryFn: () => getUsers(),
  });

  // const {
  //   isLoading: countriesAreLoading,
  //   error: countriesError,
  //   data: countriesData,
  // } = useQuery({
  //   queryKey: [`countries`],
  //   queryFn: () => getCountries(),
  // });
  //
  // if (countriesAreLoading)
  //   return (
  //     <div>
  //       <Loading />
  //     </div>
  //   );
  //
  // if (countriesError) return <Error />;
  //
  // if (countriesData) {
  //   if (!country) {
  //     setCountry(countriesData[0]);
  //   }
  //
  //   //sorts alphabetically
  //   countriesData.sort((a: countryResource, b: countryResource) =>
  //     a.name.localeCompare(b.name),
  //   );

  return (
    <div
      className={`grid grid-cols-4 py-2`}
      style={{ backgroundColor: user.backgroundColor }}
    >
      {/*{countriesData.map((country, index) => (*/}
      {/*  <div key={index} className='py-6'>*/}
      {/*    <CountryCard country={country}/>*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  );
  // }

  // return <div></div>;
};

export default Homepage;
