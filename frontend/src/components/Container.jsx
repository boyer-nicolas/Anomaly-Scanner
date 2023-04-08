import React from "react";

export default class Container extends React.Component
{
    constructor(props)
    {
        super(props);
        this.props = props;
    }

    render()
    {
        return (
            <div className="container mx-auto px-4">
                {this.props.children}
            </div>
        )
    }
}