import { selectedUser } from './../services/Atoms';
import { useAtom } from 'jotai';

const Homepage = () => {
  const [user] = useAtom(selectedUser);

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
      style={{ backgroundColor: user.foregroundColor }}
    ></div>
  );
};

export default Homepage;
