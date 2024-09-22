import { useEffect, useState } from "react";
import "../styles/itemlist.css";
import axios from "axios";
import { apiUrl, formatMoney } from "./Constants";
import { toast } from "react-toastify";
function ItemList() {
  useEffect(() => {
    fetchItems();
  }, []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    await axios
      .get(`${apiUrl}/getallitems`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Unable to load Products - ${error.message}`);
        console.log(error);
      });
  };
  return (
    <div className="main-itemlist">
      <div className="label-item">
        <p>All Products</p>
      </div>
      <div className="prod-div ">
        {items.map((product) => (
          <div
            className={`product-div ${loading && "animate-pulse"}`}
            key={product.id}
          >
            <div className="div-name">
              <p>{product.name}</p>
            </div>
            <div className="div-describe">
              <p>{product.description}</p>
            </div>
            <div className="div-prices">
              <div className="price-div">
                <p>{`GHC ${formatMoney(product.cost_price)}`}</p>
              </div>
              <div className="price-div">
                <p>{`GHC ${formatMoney(product.selling_price)}`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ItemList;
