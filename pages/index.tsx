import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import { useEffect, useState } from 'react';

/* Pebble - limit the number of launches to 10 */ 
const GET_LAUNCHES = gql`
  query GetLaunches {
    launches(limit: 5) { 
      id
      mission_Name 
      launch_date_utc
      launch_success
      rocket {
        rocket_name
      }
    }
  }
`;
 
async function fetchCompanyInfo() {
  const res = await fetch('https://api.spacexdata.com/v4/company');
  if (!res.ok) throw new Error('Failed to fetch company info');
  return res.json();
}

export default function Home() {
  const { loading, error, data } = useQuery<any>(GET_LAUNCHES); //Pebble - replace any 
  const [companyInfo, setCompanyInfo] = useState<any | null>(null); //Pebble - replace any 

  useEffect(() => {
    fetchCompanyInfo().then(setCompanyInfo)
  }, []);

  if (loading || !companyInfo) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>; /* Pebble is this error handling informative/correct? */

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Mountain - Why is this empty? */}
        <Head></Head>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SpaceX Launches</h1>
          <p className="text-lg text-gray-600">Exploring the latest SpaceX missions</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700"><span className="font-medium">Name:</span> {companyInfo.name}</p>
              <p className="text-gray-700"><span className="font-medium">CEO:</span> {companyInfo.ceo}</p>
            </div>
            <div>
              <p className="text-gray-700"><span className="font-medium">Founded:</span> {companyInfo.founded}</p>
              <p className="text-gray-700"><span className="font-medium">Employees:</span> {companyInfo.employees}</p>
            </div>
          </div>
        </section>

        {/* Mountain - How can we make this component reuseable */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Launches</h2>
          <ul className="space-y-4">
            {data.launches.map((launch: any) => (  //Pebble - replace any 
              <li key={launch.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{launch.mission_name}</h3>
                <p className="text-gray-700"><span className="font-medium">Rocket:</span> {launch.rocket.rocket_name}</p>
                <p className="text-gray-700">
                  <span className="font-medium">Launch Date:</span> {new Date(launch.launch_date_utc).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
