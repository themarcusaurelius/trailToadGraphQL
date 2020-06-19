import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Spinner from './components/Spinner/Spinner'
import { MDBBtn, MDBCard, MDBCardImage, MDBCol } from "mdbreact";
import './App.css';

const App = () => {
  const [data, setData] = useState([]);

  async function fetchProduct() {
    const product = await fetch("api/data/product", { method: 'GET' })
    product
      .json()
      .then(res => setData(res.data))
  };

  useEffect(() => {
    fetchProduct()
  }, []);

  return (
    <div>
      {data.image ?
        <div className="container">
          <MDBCol style={{ maxWidth: "75rem" }}>
            <div className="top-row">
              <MDBCol style={{ maxWidth: "22rem" }}>
                <MDBCard title="S-Works Stumpjumper 29">
                  <MDBCardImage
                    className="img-fluid" 
                    id="image" 
                    src={data.image} 
                    waves 

                  />
                </MDBCard>
              </MDBCol>
              <div className="details">
                <h4><b>{data.name}</b></h4>
                <div>{data.brand}</div>
                <br/>
                <h5><b>${data.price}</b></h5>
                <MDBBtn 
                  gradient="aqua" 
                  id="button" 
                  style={{ width: "8rem" }}
                  href="https://trailtoad.mybigcommerce.com/cart.php?action=buy&sku=SKU-112&source=buy_button"
                >
                  Buy Now
                </MDBBtn>
              </div>
            </div>  
            <div className="description">
              <h5><b>Description:</b></h5>
              {ReactHtmlParser(data.description)}
            </div>
          </MDBCol>
        </div>
        : <div className="spinner">
            <Spinner/>
          </div>
        }
    </div>
  );
}

export default App;
