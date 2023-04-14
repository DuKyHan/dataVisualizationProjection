import WorldMap from "../../components/WorldMap/WorldMap";
import "./Home.scss";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LineChartCountries from "../../components/Graph/LineChartCountries";
import DropList from "../../components/DropList/DropList";
import LineChartCompare from "../../components/Graph/LineChartCompare";
import { useAppDispatch } from "../../ultils/store";
import { getCountriesData } from "../../reduxState/lineChartSlice";
import DropListCompare from "../../components/DropList/DropListCompare";
import BarChart from "../../components/Graph/BarChart";
const Home = () => {
  const [covidCases, setCovidCases] = useState<Array<Object> | []>([]);
  const dispatch = useAppDispatch();
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
    dispatch(getCountriesData());
  }, []);
  return (
    <div className="container" id="props-basic">
      <h1>World Covid Map</h1>
      {covidCases.length > 0 && <WorldMap data={covidCases} />}
      <section className="linechart_container">
        <div>
          <DropList />
          <LineChartCountries width={800} height={500} />
        </div>
        <div>
          <DropList />
          <LineChartCountries width={800} height={500} />
        </div>

        {/* <DropListCompare />
        <LineChartCompare width={800} height={500} /> */}
      </section>
      {/* <BarChart width={800} height={500} /> */}
    </div>
  );
};

export default Home;
