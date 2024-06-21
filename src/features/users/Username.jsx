import { useSelector } from "react-redux"

function Username() {
  const username = useSelector((state) => state.user.username);

  if(!username) return null;


  return (
    <div className="text-sm font-semibold hidden md:block">
      {username}
    </div>
  )
}

export default Username;

// Hãy nhớ rằng cách chúng ta lấy một số trạng thái từ Redux bên trong thành phần React là sử dụng hook "useSelector"