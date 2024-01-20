import React,{useEffect,useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function Home() {
  const [search, setsearch] = useState("")
  const [foodCat, setfoodCat] = useState([]);
  const [foodItem, setfoodItem] = useState([]);

  const loadData = async () => {
    let resp = await fetch("http://localhost:5000/api/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
    });
    resp = await resp.json();
    setfoodItem(resp[0]);
    setfoodCat(resp[1]);
    //console.log(resp[0],resp[1]);
  }

  useEffect(() => {
    loadData();
  }, [])


  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div><div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
    <div className="carousel-inner" id='carousel'>
    <div className='carousel-caption' style={{zIndex:"10"}}> 
    <div className="d-flex justify-content-center">
      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => {setsearch(e.target.value)}}/>
      <button className="btn btn-outline-success text-white bg-success" type="submit">Search</button>
    </div>
    </div>

      <div className="carousel-item active" >
        <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" style={{filter:"brightness(30%)",objectFit:"contain !important"}} alt="..."/>
      </div>
      <div className="carousel-item">
        <img src="https://source.unsplash.com/random/900x700/?coffee" className="d-block w-100" style={{filter:"brightness(30%)",objectFit:"contain !important"}} alt="..."/>
      </div>
      <div className="carousel-item">
        <img src="https://source.unsplash.com/random/900x700/?tea" className="d-block w-100" style={{filter:"brightness(30%)",objectFit:"contain !important"}} alt="..."/>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
  </div>
     <div className="container">{
      foodCat.length !== 0 ? foodCat.map((data)=>{
        return (
          <div className="row mb-3"><div key={data._id} className="fs-3 m-3">{data.CategoryName}</div><hr/>{
            foodItem.length !== 0 ? foodItem.filter((item) => (item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLocaleLowerCase()))).map(filterItems => {
              return (
                <div key={filterItems._id} className="col-12 col-md-6 col-lg-3">
                  <Card foodName = {filterItems.name }
                    options = {filterItems.options[0]}
                    imgSrc = {filterItems.img}
                  ></Card>
                </div>
              )
            }) : <div>No such data is found.</div>
          }</div>
        )
      }): ""
     }</div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
