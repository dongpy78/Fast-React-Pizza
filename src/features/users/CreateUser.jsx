import { useState } from 'react';
import Button from '../../ui/Button';
import { useDispatch } from 'react-redux';
import { updateName } from './userSlice';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Hàm xử lý khi người dùng ấn vào biểu mẫu form
  function handleSubmit(e) {
    e.preventDefault();
    if(!username) return;
    dispatch(updateName(username)); // "username" chính là "action" | state.username = action.payload -> state.username = action.username
    // tức là "payload" sẽ thay thế cho "username". Và tất nhiên, ngay khi điều đó xảy ra ứng dụng sẽ kết xuất lại và hiển thị tên người 
    // dùng ở mọi nơi

    // ====== Chuyển Hướng Đến Menu =======
    navigate('/menu');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className='mb-4 text-sm text-stone-600 md:text-base'>👋 Welcome! Please start by telling us your name:</p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='w-72 input mb-8'
      />

      {username !== '' && (
        <div>
          <Button type="primary">Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
