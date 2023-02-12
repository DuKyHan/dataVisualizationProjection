import WorldMapAtlas from "../../components/WorldMap/WorldMapAtlas";
import "./Home.scss";
const Home = () => {
  return (
    <div className="container" id="props-basic">
      <h1>World Covid Map</h1>
      <WorldMapAtlas />
    </div>
  );
};

export default Home;
