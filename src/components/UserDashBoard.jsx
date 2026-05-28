import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../Category";
import CategoryCard from "./CategoryCard";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";


function UserDashBoard() {
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
   const navigate=useNavigate()
  // Category buttons state
  const [showCateLeft, setShowCateLeft] = useState(false);
  const [showCateRight, setShowCateRight] = useState(false);

  // Shop buttons state
  const [showShopLeft, setShowShopLeft] = useState(false);
  const [showShopRight, setShowShopRight] = useState(false);
 








  const { city, shopsInMyCity,itemsInMyCity, searchItems } = useSelector((state) => state.user);

   console.log("hey this is search data user slice ",searchItems);
  /** ✅ Update scroll button visibility for a given section */
  const updateScrollButtons = (ref, setLeft, setRight) => {
    const el = ref.current;
    if (!el) return;

    setLeft(el.scrollLeft > 0);
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  /** ✅ Handle horizontal scrolling */
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };






  







  useEffect(() => {
    const cateEl = cateScrollRef.current;
    const shopEl = shopScrollRef.current;
    if (!cateEl || !shopEl) return;

    // Initial update
    updateScrollButtons(cateScrollRef, setShowCateLeft, setShowCateRight);
    updateScrollButtons(shopScrollRef, setShowShopLeft, setShowShopRight);

    // Handlers
    const handleCateScroll = () =>
      updateScrollButtons(cateScrollRef, setShowCateLeft, setShowCateRight);
    const handleShopScroll = () =>
      updateScrollButtons(shopScrollRef, setShowShopLeft, setShowShopRight);

    const handleResize = () => {
      handleCateScroll();
      handleShopScroll();
    };

    // Attach listeners
    cateEl.addEventListener("scroll", handleCateScroll);
    shopEl.addEventListener("scroll", handleShopScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cateEl.removeEventListener("scroll", handleCateScroll);
      shopEl.removeEventListener("scroll", handleShopScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [categories, shopsInMyCity]);


   const [updatedItemsList,setupdatedItemsList]=useState([])



     const handleFilterByCategory=(category)=>{

      if(category=="All")
      {

        setupdatedItemsList(itemsInMyCity)

     }else{

        console.log("this is my filterd data ");
        const filteredList=itemsInMyCity.filter(i=>i.category===category)
        setupdatedItemsList(filteredList);

     }
    }

    useEffect(()=>{
      setupdatedItemsList(itemsInMyCity)
    },[itemsInMyCity])
    


  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />


    {searchItems  && searchItems.length>0 &&(

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
           <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
               Search Results
           </h1>
            <div className="w-full h-auto flex flex-wrap gap-6 justify-center">

                   {searchItems.map((item)=>(

                      <FoodCard data={item} key={item._id}/>
                   ))}
              </div> 

      </div>

    )}



      {/* Category Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative">
          {/* Left Scroll Button */}
          {showCateLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaAngleLeft />
            </button>
          )}

          {/* Scrollable Category Cards */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard data={cate} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)}/>
            ))}
          </div>

          {/* Right Scroll Button */}
          {showCateRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Shop Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {city || "your city"}
        </h1>

        <div className="w-full relative">
          {/* Left Scroll Button */}
          {showShopLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaAngleLeft />
            </button>
          )}

          {/* Scrollable Shops */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth"
            ref={shopScrollRef}
          >
            {shopsInMyCity?.length ? (
              shopsInMyCity.map((shop, index) => (
                <CategoryCard data={shop} image={shop.image.url} key={index} onClick={()=>navigate(`/shop/${shop._id}`)}/>
              ))
            ) : (
              <p className="text-gray-500 italic px-2">
                No shops available in this city.
              </p>
            )}
          </div>

          {/* Right Scroll Button */}
          {showShopRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] ">

          <h1 className="text-gray-800 text-2xl sm:text-3xl">
               Suggested Food Items
          </h1>

      </div>

      <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">

        {
          updatedItemsList?.map((item,index)=>(
            
                <FoodCard key={index} data={item} />
          ))
        }


      </div>

    </div>
  );
}

export default UserDashBoard;
