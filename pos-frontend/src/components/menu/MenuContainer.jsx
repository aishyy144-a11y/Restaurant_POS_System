import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCategories, getDishes } from "../../https";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { useLocation } from "react-router-dom";
import { getImageUrl } from "../../utils";


const MenuContainer = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const [menuData, setMenuData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const dispatch = useDispatch();
  const location = useLocation();
  const hideCart = location.state?.hideCart;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dishRes] = await Promise.all([getCategories(), getDishes()]);
        const categories = catRes.data.data.categories;
        const dishes = dishRes.data.data.dishes;

        const processed = categories.map((cat) => ({
          id: cat._id,
          name: cat.name,
          bgColor: cat.bgColor,
          icon: cat.icon,
          image: cat.image,
          items: dishes
            .filter((d) => d.category && d.category._id === cat._id)
            .map((d) => ({
              id: d._id,
              name: d.name,
              price: d.price,
              qtyUnit: d.qtyUnit,
              description: d.description,
              image: d.image,
            })),
        }));
        setMenuData(processed);
        if (processed.length > 0) setSelected(processed[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if(itemCount === 0) return;

    const {name, price} = item;
    const newObj = { id: Date.now(), name, pricePerQuantity: price, quantity: itemCount, price: price * itemCount };

    dispatch(addItems(newObj));
    setItemCount(0);
  }


  // Theme-aware classes
  const categoryBg = isDark ? "" : "bg-sky-100";
  const categoryText = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const categoryTextSecondary = isDark ? "text-[#ababab]" : "text-gray-600";
  const itemBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-100";
  const itemHover = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-sky-200";
  const itemText = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const counterBg = isDark ? "bg-[#1f1f1f]" : "bg-sky-200";
  const counterText = isDark ? "text-white" : "text-blue-900";
  const borderColor = isDark ? "border-[#2a2a2a]" : "border-gray-300";
  const headingBg = isDark ? "bg-[#262626]" : "bg-sky-100";

  return (
    <>
      <div className="px-4 md:px-10 mt-4">
        <span className={`${headingBg} ${categoryText} text-base md:text-lg font-bold px-4 py-2 rounded-lg inline-block`}>Categories</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-10 py-4 w-[100%]">
        {menuData.map((menu) => {
          return (
            <div
              key={menu.id}
              className={`flex flex-col cursor-pointer transition-all duration-300 group rounded-lg ${
                selected?.id === menu.id ? "scale-105 shadow-lg" : "hover:scale-105"
              }`}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div
                className={`w-full rounded-t-lg h-[100px] md:h-[150px] ${categoryBg} bg-cover bg-center ${
                  selected?.id === menu.id 
                    ? "border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-r-2 md:border-r-4 border-yellow-500" 
                    : "group-hover:border-t-2 md:group-hover:border-t-4 group-hover:border-l-2 md:group-hover:border-l-4 group-hover:border-r-2 md:group-hover:border-r-4 group-hover:border-gray-300"
                }`}
                style={{ 
                  backgroundColor: isDark ? menu.bgColor : undefined,
                  backgroundImage: menu.image ? `url(${getImageUrl(menu.image)})` : undefined,
                }}
              >
              </div>
              <div className={`flex items-center justify-between w-full p-2 rounded-b-lg border-l border-r border-b ${
                selected?.id === menu.id 
                  ? "border-l-2 md:border-l-4 border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-yellow-500" 
                  : isDark 
                    ? "border-gray-600 group-hover:border-gray-300 group-hover:border-l-2 md:group-hover:border-l-4 group-hover:border-r-2 md:group-hover:border-r-4 group-hover:border-b-2 md:group-hover:border-b-4" 
                    : "border-gray-300 group-hover:border-gray-300 group-hover:border-l-2 md:group-hover:border-l-4 group-hover:border-r-2 md:group-hover:border-r-4 group-hover:border-b-2 md:group-hover:border-b-4"
              }`}>
                <h1 className={`${categoryText} text-sm md:text-lg font-semibold truncate`}>
                  {menu.icon} {menu.name}
                </h1>
                <p className={`${categoryTextSecondary} text-[10px] md:text-sm font-semibold whitespace-nowrap`}>
                  {menu.items.length} Items
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <hr className={`${borderColor} border-t-2 mt-4`} />

      <div className="px-4 md:px-10 mt-6">
        <span className={`${headingBg} ${categoryText} text-base md:text-lg font-bold px-4 py-2 rounded-lg inline-block`}>Dishes</span>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-10 py-4 w-[100%]">
        {selected?.items.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col cursor-pointer rounded-lg shadow-sm"
            >
              <div 
                className="w-full h-[120px] md:h-[150px] bg-cover bg-center rounded-t-lg bg-gray-200"
                style={{ backgroundImage: item.image ? `url(${getImageUrl(item.image)})` : undefined }}
              >
              </div>
              <div className={`flex flex-col justify-between w-full p-2 md:p-3 rounded-b-lg border-l border-r border-b ${
                isDark ? "border-gray-600" : "border-gray-300"
              }`}>
                <div className="flex items-start justify-between w-full mb-2 gap-1">
                  <h1 className={`${itemText} text-sm md:text-lg font-semibold truncate`}>
                    {item.name}
                  </h1>
                  {!hideCart && (
                    <button onClick={() => handleAddToCart(item)} className="bg-[#2e4a40] text-[#02ca3a] p-1.5 md:p-2 rounded-lg flex-shrink-0"><FaShoppingCart size={16} className="md:w-5 md:h-5" /></button>
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2">
                  <div className="flex flex-col">
                    <p className={`${itemText} text-base md:text-lg font-bold whitespace-nowrap`}>
                      PKR {item.price}
                    </p>
                    {item.qtyUnit && <span className={`${itemText} text-[10px] md:text-sm font-normal`}>/ {item.qtyUnit}</span>}
                  </div>
                  {!hideCart && (
                    <div className={`flex items-center justify-center ${counterBg} px-2 md:px-4 py-1.5 md:py-2 rounded-lg gap-2 w-full md:w-[60%]`}>
                      <button
                        onClick={() => decrement(item.id)}
                        className="text-yellow-500 text-xl md:text-2xl flex items-center justify-center min-w-[24px] md:min-w-[32px] h-full"
                      >
                        &minus;
                      </button>
                      <span className={`${counterText} flex-1 text-center text-sm md:text-base`}>
                        {itemId == item.id ? itemCount : "0"}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="text-yellow-500 text-xl md:text-2xl flex items-center justify-center min-w-[24px] md:min-w-[32px] h-full"
                      >
                        &#43;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MenuContainer;
