import WorldMap from "../../components/WorldMap/WorldMap";
import "./Home.scss";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "../../components/Graph/LineChart";
const Home = () => {
  const [covidCases, setCovidCases] = useState<Array<Object> | []>([]);

  const getAllCovidCases = async () => {
    axios
      .get("https://disease.sh/v3/covid-19/countries")
      .then(function (response: any) {
        setCovidCases(response.data);
        return response.data;
      })
      .catch(function (error: any) {
        console.error(error);
      });
  };

  useEffect(() => {
    getAllCovidCases();
  }, []);
  return (
    <div className="container" id="props-basic">
      <h1>World Covid Map</h1>
      {covidCases.length > 0 && <WorldMap data={covidCases} />}
      {/* <LineChart width={800} height={500} /> */}
    </div>
  );
};

export default Home;
