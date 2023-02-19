import React from "react";
import "./ToolTipContainer.scss";
type Props = {
  cases: String;
  recover: String;
  todayCases: String;
  flag: String;
  country: String;
  deaths: String;
  casesPerOneMillion: string;
};
const ToolTipContainer: React.FC<Props> = ({
  cases,
  country,
  deaths,
  flag,
  casesPerOneMillion,
}) => {
  return (
    <div className="tooltip-container">
      <section className="tooltip-title">
        <img src={`${flag}`} alt={`${country}`} />
        <h4>{country}</h4>
      </section>

      <p>Cases: {cases}</p>
      <p>Deaths: {deaths}</p>
      <p>Cases Per Million: {casesPerOneMillion}</p>
    </div>
  );
};

export default ToolTipContainer;
