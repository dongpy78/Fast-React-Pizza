import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import AppLayout from "./ui/AppLayout";

import {action as updateOrderAciton} from './features/order/OrderUpdate';

// Tạo đường dẫn Router
const router = createBrowserRouter([
  {
    element: <AppLayout />, // Chứa các components chính của ứng dụng: header, footer, hoặc thanh điều hướng
    // Xử lý lỗi
    errorElement: <Error />, // Component sẽ được hiển thị nếu có lỗi xảy ra trong bất cứ tuyến đường con nào

    children: [ // Mảng children chứa các đối tượng định nghĩa các tuyến đường cụ thể của ứng dụng 
      {
        // Component Home sẽ được hiển thị khi người dùng truy cập vào "/"
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        // Xử lý lỗi
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAciton,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
