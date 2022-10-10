import React from 'react';
import {Link} from 'react-router-dom';
import './Truck.css'
const Truck = (props) => {
    const {truckId,name,imageUrl} = props.food;
    return (
        <div className="col-md-4 mb-4">
            <Link to={"truck/"+truckId}>
                <div className="card text-center">
                    <img src={imageUrl} alt="" loading="lazy" className="card-img-top"/>
                    <div className="card-body">
                        <h5>{name}</h5>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Truck;