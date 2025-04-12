import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "../Auth/SignUP"
import Login from "../Auth/Login"
import OtpVerification from "../Auth/Otp"
import AddJob from "../Components/Master/AddMaster"
import ProductInventoryPage from "../Components/Pages/ProductInventoryPage"
import AddCountProduct from "../Components/Pages/AddCountProduct"
import ShowAllCC from "../Components/Pages/UserCC/ShowAllCC"
import ShowAllCCWdCode from "../Components/Pages/UserCC/ShowAllCCWdCode"

const Route = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/Sign-Up",
            element: <SignUp />,
        },
        {
            path: "/Otp-verification",
            element: <OtpVerification />,
        },
        {
            path: "/Add-Master",
            element: <AddJob />,
        },

        //ProductInventoryPage
        {
            path: "/product-data",
            element: <ProductInventoryPage />,
        },
        
        //AddCountProduct
        {
            path: "/add_count_product",
            element: <AddCountProduct />,
        },

        //ShowAllCC

        {
            path: "show-all-cc",
            element: <ShowAllCC />,
        },
        {
            path: "/show-all-cc/:wdCode",
            element: <ShowAllCCWdCode />,
        },



    ])
    return (
        <RouterProvider router={router} />
    )
}

export default Route