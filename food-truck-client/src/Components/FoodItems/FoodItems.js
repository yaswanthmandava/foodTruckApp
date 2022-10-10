import React, {useState, useEffect}  from 'react';
import FoodItem from '../FoodItem/FoodItem';
import './FoodItems.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
const FoodItems = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3300/api/v1/foodItems')
        .then(res => res.json())
        .then(data => {
            setItems(data);
        })
        .catch(err => console.log(err))
    } ,[]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = () => {
        setShow(false);
        const formData = {...form};
        formData['price'] = parseInt(formData['price']);
        fetch('http://localhost:3300/api/v1/foodItems', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            setItems([...items,data]);
            setForm({});            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    const handleChange = (event, key) =>{
        const obj = {...form};
        obj[key]= event.target.value;
        setForm({...obj});
    }

    return (
        <>
            <h6 className='text-center'>Food Items</h6>
            <div class="row">
                <Button className='col-sm-3 float-right' onClick={()=>handleShow()}> Add Food item </Button>
            </div>
            <section className="food-items d-flex vertical-overflow">
                <div className="row my-5">                   
                    {
                        items.map(item => <FoodItem key={item.itemId}  food={item} />)
                    }
                </div>
            </section>
            <Modal show={show} onHide={handleClose} fullscreen={'md-down'}>
                <Modal.Header closeButton>
                <Modal.Title>Food Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="item name"
                            onChange={(event)=>handleChange(event,'name')}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.description"
                    >
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} onChange={(event)=>handleChange(event,'description')} />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.url"
                    >
                        <Form.Label>url</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="url"
                            onChange={(event)=>handleChange(event,'imageUrl')}
                        />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.price"
                    >
                        <Form.Label>price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="0"
                            onChange={(event)=>handleChange(event,'price')}
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>        
    );
};

export default FoodItems;