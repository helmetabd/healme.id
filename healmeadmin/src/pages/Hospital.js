import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ReadMoreReact from 'read-more-react';

function Hospital() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [ hospital, setHospital ] = useState({});

    const fetchHospital = () => {
        fetch(`http://localhost:8083/api/hospital/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization : `${localStorage.getItem("Authorization")}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw { message: 'Something went wrong', status: response.status }
            }
        })
        .then(data => {
            // console.log(data)
            setHospital(data)
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    const buy = () => {
        fetch(`http://localhost:8080/api/hospital/buy/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `${localStorage.getItem("Authorization")}`
          },
          body: JSON.stringify({totalBuy: 1}),
          method: 'PUT'
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setHospital({...hospital, stocks: hospital.stocks - 1});
        })
        .catch(err => {
            console.log(err);
        })
    }

    const remove = () => {
        fetch(`http://localhost:8083/api/hospital/delete/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization : `${localStorage.getItem("Authorization")}`
        },  
        method: 'DELETE'
        })
        .then(response => {
            return response;
        })
        .then(data => {
            navigate("/hospital");
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchHospital();
    }, []);

    useEffect(() => {
        fetchHospital();
    }, [ hospital.stocks ]);

    return (
        <div className="card mb-3 mx-auto p-3 mt-4 insert" style={{maxWidth: "800px"}} key={hospital.id}>
            <div className="row g-0">
                <div className="col-md-4">
                    <h5 className="card-title">{hospital.name}</h5>
                    <img src={hospital.image} className="img-fluid rounded-start"/>
                    {/* <h4 className="mt-3">Author: {hospital.author}</h4> */}
                </div>
                <div className="col-md-8">
                    <div className="card-body d-flex">
                        <div >
                            <p className="card-text">{hospital.description}</p>
                            <p className="card-text">{hospital.address}</p>
                        </div>
                        <div>
                            <button onClick={() => buy(hospital.id)} disabled={(hospital.stocks === 0) ? true : false}>Buy</button>
                            <button onClick={remove}>Remove</button>
                            <button>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Hospital;