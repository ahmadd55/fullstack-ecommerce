import Home from "../pages/Home";
import { Link } from "react-router-dom";

export default function Card({ product }) {
  
  const imagePath = product.images?.[0]?.image || product.images?.[0];

  
  const imgSrc = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:3000${imagePath}` 
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <Link to={`/detail/${product.id}`} className="card-link">
      <div className="cards">

        <img src={imgSrc} alt={product.title || "Product"} />

        <div className="new-chart-btn">
          <button id="btn1">New</button>

          <div className="btn-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="16"
              viewBox="0 0 12 16"
              fill="#232323"
              className="icon icon-cart"
            >
              <path
                d="M8.46861 14.9963V12.437H5.81787V11.5839H8.46861V9.02457H9.35219V11.5839H12.0029V12.437H9.35219V14.9963H8.46861Z"
                fill="#232323"
              />
              <path
                d="M10.2257 4.68741C11.3251 4.80893 12.1358 5.81656 11.9845 6.94131L11.461 10.8319H10.3507L10.8946 6.79483L10.9024 6.69424C10.9141 6.19668 10.5127 5.77432 10.0021 5.77432H2.05283C1.50823 5.77452 1.08858 6.25506 1.16123 6.79483L2.06748 13.5292C2.12759 13.9758 2.50948 14.3094 2.96006 14.3095H7.22373V15.4091H2.96006L2.77354 15.4013C1.91622 15.3218 1.20382 14.6984 1.01084 13.8593L0.977637 13.6767L0.0704101 6.94131C-0.0807972 5.81681 0.730126 4.80926 1.8292 4.68741L2.05283 4.67471H10.0021L10.2257 4.68741Z"
                fill="#232323"
              />
              <path
                d="M6.20898 0.419098C8.06868 0.513381 9.5476 2.05068 9.54785 3.93375V7.49429H8.44824V3.93375C8.44798 2.59759 7.36447 1.51409 6.02832 1.51382C4.69194 1.51382 3.60769 2.59743 3.60742 3.93375V7.49429H2.50781V3.93375C2.50808 1.98992 4.08443 0.414215 6.02832 0.414215L6.20898 0.419098Z"
                fill="#232323"
              />
            </svg>
            <button id="btn2">Add to Cart</button>
          </div>
        </div>

        <p>{product.title}</p>
        <p>Rs.{product.price}</p>
      </div>
    </Link>
  );
}
