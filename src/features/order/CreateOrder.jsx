import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // const [withPriority, setWithPriority] = useState(false);

  // Trả về lỗi và lấy nó để hiển thị lên giao diện người dùng
  const formErrors = useActionData();

  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Order now"}
          </button>
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
    priority: data.priority === "on",
  };

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
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
