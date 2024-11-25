import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../users/userSlice";


// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {username, status: addressStatus, position, address, error: errorAddress,} = useSelector((state)=> state.user);

  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Trả về lỗi và lấy nó để hiển thị lên giao diện người dùng
  const formErrors = useActionData();
  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  // console.log(cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if(!cart.length) return <EmptyCart/>

  return (
    <div className="py-6 px-4">
      
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>


      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input type="text" name="customer" className="input grow" required defaultValue={username} />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          {formErrors?.phone && <p className="text-xs p-2 mt-2 text-red-700 bg-red-100 rounded-md">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input defaultValue={address} disabled={isLoadingAddress} className="input w-full" type="text" name="address" required  />
            {addressStatus === 'error' && <p className="text-xs p-2 mt-2 text-red-700 bg-red-100 rounded-md">{errorAddress}</p>}

          </div>
          {!position.latitude && !position.longitude && (<span className="absolute right-[3px] top-[35px] z-20 sm:top-[3px] md:right-[5px] md:top-[5px]">
            <Button disabled={isLoadingAddress} type='small' onClick={(e)=> {
              
              e.preventDefault();
              dispatch(fetchAddress());
            }}
              >
                Get position
            </Button>
          </span>)}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.longitude && position.latitude ? `${position.latitude}, ${position.longitude}` : ''}/>
          <Button disabled={isSubmitting || isLoadingAddress} type="primary" >
            {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}` }
          </Button>
        </div>
      </Form>
    </div>
  );
}
/*
Chúng ta có biểu mẫu "<Form/>" ở trên và sau đó ReactRouter sẽ lo phần
còn lại. 

*/

// lấy dữ liệu từ form khi người dùng gửi
export async function action({ request }) {
  // Đầu tiên chúng ta nhận được tất cả dữ liệu từ "Form"

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Sau đó chúng ta tạo đối tượng đơn hàng mới và gửi nó cùng với "createOrder"
  // trong hàm createOrder chúng ta có phương thức "POST" và đơn hàng sẽ đc tạo ở trong hàm này
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  console.log(order)

  // Xử lý lỗi
  const errors = {};
  // Nếu điều kiện này không hợp lệ
  if (!isValidPhone(order.phone))
    // Thêm thuộc tính "phone" vào đối tượng "error"
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";
  // đối tượng lỗi này sau đó đã được trả về ngay lập tức do đó newOrder không được tạo ra
  if (Object.keys(errors).length > 0) return errors;

  // Sau đó chúng ta lấy lại đối tượng đơn hàng mới đó và chuyển
  // Nếu mọi thứ đều ổn thì chuyển hướng đến order/newOrderId
  
  const newOrder = await createOrder(order);

  // Do NOT overuse
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
