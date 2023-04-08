import React from 'react'
import ListScannedCodes from "../components/ListScannedCodes";

export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);
    this.showButton = props.showButton || false;
  }

  componentDidMount()
  {
    document.title = 'MTAS - Accueil';
  }


  render()
  {
    return (
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Bienvenue</h1>
            <ListScannedCodes showButton={true} />
          </div>
        </div>
      </div>
    );
  }
}
