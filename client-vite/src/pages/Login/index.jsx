import { Button, Form, Input, Radio, message } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdInputValidation } from "../../utils/helpers";
const typeReadable = {
  donor: "Αιμοδότη",
  hospital: "Νοσοκομείου",
  organization: "Οργανισμού",
};

function Login() {
  const [type, setType] = React.useState("donor");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await LoginUser(values);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <Form
        layout="vertical "
        className="bg-white rounded shadow grid  p-5 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className=" ">
          <span className="text-secondary">
            {" "}
            Σύνδεση - {typeReadable[type]}{" "}
          </span>
          <hr />
        </h1>
        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
          className=""
        >
          {Object.entries(typeReadable).map(([key, value]) => (
            <Radio key={key} value={key}>
              {value}
            </Radio>
          ))}
        </Radio.Group>
        <Form.Item label="Email" name="email" rules={getAntdInputValidation()}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Κωδικός"
          name="password"
          rules={getAntdInputValidation()}
        >
          <Input type="password" />
        </Form.Item>{" "}
        <Button type="primary" block className="" htmlType="sumbit">
          Σύνδεση
        </Button>
        <Link to="/register" className=" text-center text-gray-600 underline">
          Δεν έχετε λογαριασμό; Κάνε εγγραφή!
        </Link>
      </Form>
    </div>
  );
}

export default Login;
