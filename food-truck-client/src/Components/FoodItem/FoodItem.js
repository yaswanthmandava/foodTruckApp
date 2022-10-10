import React from 'react';
import {Link} from 'react-router-dom';
const Truck = (props) => {
    const {itemId,name,imageUrl,price} = props.food;
    return (
        <div className="col-md-4 mb-4">
            <Link to={"food/"+itemId}>
                <div className="card text-center">
                    <img src={imageUrl} alt="" loading="lazy" className="card-img-top"/>
                    <div className="card-body">
                        <h5>{name}</h5>
                        <h4>${price.toFixed(2)}</h4>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Truck;