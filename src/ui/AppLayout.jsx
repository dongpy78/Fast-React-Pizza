import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import Header from "./Header";
import Loader from "./Loader";

function AppLayout() {
  const navigation = useNavigation();
  // "navigation.state" Thuộc tính này chỉ ra trạng thái hiện tại của quá trình điều hướng.
  // Các trạng thái phổ biến có thể bao gồm idle, loading, submitting, v.v.
  // Nó kiểm tra xem trạng thái điều hướng hiện tại có phải là "loading" hay không.
  // Nếu navigation.state là "loading", isLoading sẽ là true; nếu không, nó sẽ là false.
  const isLoading = navigation.state === "loading";
  // console.log(navigation);

  return (
    <div className="layout">
      {isLoading && <Loader />}

      <Header />
      <main>
        <Outlet />
      </main>
      <CartOverview />
    </div>
  );
}

export default AppLayout;