import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getAddress} from '../../services/apiGeocoding';


function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}



/* 
Ta có thể thấy "fetchAddress" là một hàm không đồng bộ có nghĩa là chúng ta không thể gọi hàm này 
trực tiếp bên trong bộ giảm tốc Redux, hãy nhớ rằng Redux về bản chất là hoàn toàn đồng bộ và đó là 
lý do tại sao chúng ta phải sử dụng Thunks. Và "Thunk" là một phần mềm trung gian nằm giữa chính 
"dispatch" và "reduces" 
*/


/*
  TÓM TẮT NHỮNG GÌ ĐÃ LÀM 
  Lần này ta sẽ tạo hàm "Thunk" của Redux Toolkit, và ta sẽ chuyển vào tên loại hành động và 
  đối số thứ 2 ta chuyển vào hàm "Thunk" một "function" để mà khi hành động "user/fetchAddress"
  này sẽ được gửi đi. Điều đặt biệt ở đây là "createAsyncThunk" cơ bản sẽ tạo ra 3 loại hành động bổ sung
  Vì vậy 1 cho trạng thái lời hứa phụ thuộc, một cho trạng thái hoàn thành, một cho trạng thái bị
  từ chối. Và ta sẽ xử lý các trường hợp này 
*/
// ========== THUNK ==========
export const fetchAddress = createAsyncThunk('user/fetchAddress', async function() {
  // 1) We get the user's geolocation position (Lấy vị trí định vị địa lý của người dùng được cung cấp bởi hàm getPosition ngay tại đây)
  // Sau đó về cơ bản nó sẽ gọi 
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  // Payload of the FULFILLED state
  return { position, address };
});



//============USE REDUX TOOLKIT=============
const initialState = { // bắt đầu với đối tượng initialState 
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({ 
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) { // Nhận vào trạng thái hiện tại và đối tượng "action"
      state.username = action.payload; // chúng ta có thể thay đổi "state.username" và đặt nó thành tên người dùng đã nhận.
    },
  },
  extraReducers: (builder) => builder.addCase(fetchAddress.pending, (state, action)=>{state.status = 'loading';})
  .addCase(fetchAddress.fulfilled, (state, action) => {
    state.position = action.payload.position;
    state.address = action.payload.address;
    state.status = 'idle';
  })
  .addCase(fetchAddress.rejected, (state, action) => {
    state.status = 'error';
    state.error = 'There was a problem getting your address. Make sure to fill this field!';
  })
});

export const {updateName} = userSlice.actions; // xuất nó ra 
export default userSlice.reducer; // Sử dụng cái này để thiết lập hoặc lưu trữ 




// Đầu tiên tạo một 1 phần trạng thái giao diện người dùng toàn cầu của mình bằng cách sử dụng hàm createSlice.
// Sau đó ta sẽ tạo 1 slice gọi là "user" có trạng thái ban đầu tại đây "username"
// Và sau đó ta có reducers, đây là hàm chịu trách nhiệm cập nhật đối tượng trạng thái "updateName"
// vì vậy trong trường hợp này là phương thức, nhận vào trạng thái hiện tại và hành động 
// và chúng ta sử dụng Redux Toolkit nên chúng ta có thể thay đổi đối tượng trạng thái "username"
// và sau đó đặt thuộc tính "state.username" thành tên mà ta nhận được ngay khi chúng ta chuẩn bị thực hiện hành động 
// vì vậy đó sẽ là "action.payload".
// Nhưng sau đó bên trong "userSlice.actions" chúng ta sẽ có quyền truy cập vào những người tạo hành động 
// Và vì vậy chúng ta xuất nó ở đây dưới dạng xuất có tên là "updateName" để sau đó có thể sử dụng trong ứng dụng 

// Sau đó tạo file có tên là store.js ở cấp cao nhất trong thư mục "src"
// Sau đó cung cấp trạng thái toàn cầu cho toàn bộ cây ứng dụng ở file "main.jsx"