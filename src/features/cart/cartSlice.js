import { createSlice } from "@reduxjs/toolkit";

/*
  `initialState` là trạng thái ban đầu của slice cart. Trong trường hợp này, giỏ hàng (cart) được khởi tạo như một mảng rỗng.
*/
const initialState = {
  cart: [],
  // cart: [
  //   {
  //     pizzaId: 12,
  //     name: 'Mediterranean',
  //     quantity: 2,
  //     unitPrice: 16, 
  //     totalPrice: 32,
  //   }
  // ]
};

/*
createSlice là một hàm của Redux Toolkit giúp tạo ra một slice bao gồm các action creators và reducer.
name: 'cart': Đặt tên cho slice là 'cart'.
initialState: Trạng thái ban đầu được sử dụng là initialState đã được định nghĩa ở trên.
reducers: Đây là nơi định nghĩa các hàm reducer để xử lý các hành động khác nhau.
*/
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // payload = newItem
      state.cart.push(action.payload);  
    },
    deleteItem(state, action) {
      // payload = pizzaId
      state.cart = state.cart.filter((item)=>item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      // Chúng ta muốn tăng số lượng 1 mặt hàng nào đó
      // trước tiên hãy tìm mặt hàng đó và sau đó chúng ta có thể thay đổi số lượng của mặt hàng đó.
      const item = state.cart.find((item)=>item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item)=>item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if(item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart} = cartSlice.actions

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) => state.cart.cart.reduce((sum, item)=>sum + item.quantity, 0);

export const getTotalCartPrice = (state) => state.cart.cart.reduce((sum, item)=>sum + item.totalPrice, 0);

// export const getCurrentQuantityById = (id) => (state) => state.cart.cart.find((item)=>item.pizzaId === id)?.quantity ?? 0;
/*
1. Hàm "getCurrentQuantityById"
  Hàm getCurrentQuantityById nhận vào một tham số id (đây là id của loại pizza mà chúng ta muốn kiểm tra số lượng).
  Hàm này trả về một hàm khác nhận tham số là state.
2. Hàm trả về 
  Hàm trả về này nhận tham số state (đây là trạng thái của ứng dụng, trong đó có chứa thông tin về giỏ hàng).
  Trong hàm trả về này, chúng ta sử dụng state.cart.cart để truy cập vào mảng chứa các mặt hàng trong giỏ hàng.
3. Tìm kiếm pizza trong giỏ hàng:
  Phương thức .find() được sử dụng để tìm phần tử trong mảng state.cart.cart mà có pizzaId trùng với id được truyền vào.
  item là từng phần tử trong mảng, và item.pizzaId === id là điều kiện để tìm ra phần tử có pizzaId bằng với id mà chúng ta đang tìm.
4. Lấy số lượng pizza
  Toán tử ?. (Optional Chaining) được sử dụng để truy cập vào thuộc tính quantity của phần tử được tìm thấy. Nếu phần tử không tồn tại (tức là không tìm thấy pizza với id đó), nó sẽ trả về undefined.
  Toán tử ?? (Nullish Coalescing) kiểm tra nếu giá trị trước nó là null hoặc undefined, thì sẽ trả về giá trị sau nó là 0.
*/
export function getCurrentQuantityById(id) {
  return function (state) {
    return state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
  };
}