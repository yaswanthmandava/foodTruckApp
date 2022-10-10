import React, {useState} from 'react';
import './Admin.css';

import FoodTrucks from '../FoodTrucks/FoodTrucks';
import FoodItems from '../FoodItems/FoodItems';
import {adminMenuItems} from '../../Utils/Utils';
import Button from 'react-bootstrap/Button';

const Admin = () => {
    const [selectedItem, setSelectedItem] = useState('food-items'); 
    const handleSelection = (item)=>{
        setSelectedItem(item);
    }   
    return (
        <section className="admin">
            <div className='adminContainer'>
                <div className='menu'>
                    <h5 className='text-center'>Admin</h5>
                    <ul className="list-unstyled">
                        {
                            adminMenuItems.map(mi=>(
                                <li className='text-center' key={ `li-${mi.key}`} >
                                    <Button
                                    variant={ selectedItem === mi.key ? "primary" : "secondary" }
                                    onClick={()=>handleSelection(mi.key)}
                                    >
                                        {mi.label}  
                                    </Button>                                     
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className='selectedContainer'>
                    {
                        selectedItem !== 'food-items' ?
                         <FoodTrucks />
                        :
                         <FoodItems />
                    }
                </div>
            </div>
        </section>
    );
};

export default Admin;