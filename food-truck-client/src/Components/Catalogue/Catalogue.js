import React, { useState, useEffect} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import FoodItem from '../FoodItem/FoodItem';
import moment from 'moment';

import './Catalogue.css'

const Catalogue = (props) => {
    const [items, setItems] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState("");
    useEffect(() => {
        fetch('http://localhost:3300/api/v1/foodTrucks')
        .then(res => res.json())
        .then(data => {
            setTrucks(data);
        })
        .catch(err => console.log(err))
    } ,[]);
    const handleSelect = (truckId)=>{
        let truckName = trucks.filter(truck=>truck.truckId===truckId)?.[0]['name'] ||"";
        setSelectedTruck(truckName);
        const date = moment(). format('YYYY-MM-DD');
        fetch(`http://localhost:3300/api/v1/foodItemsPerTruck?truckId=${truckId}&date=${date}`)
        .then(res => res.json())
        .then(data => {
            const itemsArr = data.map(d=>{
                return {
                    itemId: d.itemId,
                    name: d.itemName,
                    description: d.itemDescription,
                    imageUrl: d.itemUrl,
                    price: d.price
                }
            });
            setItems(itemsArr);
        })
        .catch(err => console.log(err))
    }
    return (
        <div className="catalogue-container">
            <h6 className='text-center'>Food Trucks</h6>
            <DropdownButton id="dropdown-basic-button" title={ !!selectedTruck ? selectedTruck : "Select Truck"}  onSelect={handleSelect}>
                {
                    trucks.map(truck=>(
                        <Dropdown.Item key={`dropdownItem-${truck.truckId}`} eventKey={truck.truckId}>{truck.name}</Dropdown.Item>
                    ))
                }                
            </DropdownButton>
            <div className='selectedContainer catalogue' >
                <section className="food-items d-flex vertical-overflow">
                    <div className="row my-5">                                    
                    {
                        items.length>0 ?

                            items.map(item => <FoodItem key={`catalogue-${item.itemId}`}  food={item} />)
                        :
                            <></>
                    }
                    </div>
                </section>
            {
                 items.length==0 &&  <div className='empty text-center mb-1'> Please select Truck </div>
            }
            </div>
        </div>
    );
};

export default Catalogue;