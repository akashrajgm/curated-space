import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Stitch Frontend";
    
    if (path === '/') title = "Curated Store | Editorial Objects";
    else if (path.includes('/product')) title = "Curated Store | Architectural Node";
    else if (path.includes('/collections')) title = "Curated Store | The Collections";
    else if (path.includes('/interior-design')) title = "Curated Store | Spaces & Dimensions";
    else if (path.includes('/spaces')) title = "Curated Store | Living Spaces";
    else if (path.includes('/journal')) title = "Curated Store | The Journal";
    else if (path.includes('/cart')) title = "Curated Store | Secure Cart";
    else if (path.includes('/checkout')) title = "Curated Store | Transact";
    else if (path.includes('/dashboard')) title = "Curated Store | Vendor Platform";
    else if (path.includes('/wishlist')) title = "Curated Store | Saved Nodes";
    else if (path.includes('/orders')) title = "Curated Store | Operations";

    document.title = title;
  }, [location]);
}
