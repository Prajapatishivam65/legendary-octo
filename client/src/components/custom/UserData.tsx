import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface UserData {
  userId: string;
}
const UserData: React.FC = () => {
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <p className="text-lg font-semibold text-black">
        Your ID is {userData?.userId}
      </p>
      <br />
      <Button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          axios
            .post(
              `http://localhost:3000/logout`,
              {},
              {
                withCredentials: true,
              }
            )
            .then(() => {
              alert("Logged out successfully");
            });
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default UserData;
