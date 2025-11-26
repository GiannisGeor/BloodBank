import { Button, Form, Input, Radio, message } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import OrgHospitalForm from "./OrgHospitalForm";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdInputValidation } from "../../utils/helpers";

const typeReadable = {
  donor: "Αιμοδότη",
  hospital: "Νοσοκομείου",
  organization: "Οργανισμού",
};

function Register() {
  const [type, setType] = React.useState("donor");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await RegisterUser({ ...values, userType: type });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-8">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-1 md:grid-cols-2 p-5 gap-5 w-full max-w-4xl"
        onFinish={onFinish}
      >
        <h1 className="col-span-1 md:col-span-2">
          <span className="text-secondary">Εγγραφή - {typeReadable[type]}</span>
          <hr />
        </h1>

        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
          className="col-span-1 md:col-span-2"
        >
          {Object.entries(typeReadable).map(([key, value]) => (
            <Radio key={key} value={key}>
              {value}
            </Radio>
          ))}
        </Radio.Group>

        {type === "donor" && (
          <>
            <Form.Item
              label="Ονοματεπώνυμο"
              name="name"
              rules={getAntdInputValidation()}
              className="col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={getAntdInputValidation()}
              className="col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Τηλέφωνο"
              name="phone"
              rules={getAntdInputValidation()}
              className="col-span-1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Κωδικός"
              name="password"
              rules={getAntdInputValidation()}
              className="col-span-1"
            >
              <Input type="password" />
            </Form.Item>
          </>
        )}

        {type !== "donor" && <OrgHospitalForm type={type} />}
        <Button
          type="primary"
          block
          className="col-span-1 md:col-span-2"
          htmlType="sumbit"
        >
          Εγγραφή
        </Button>
        <Link
          to="/login"
          className="col-span-1 md:col-span-2 text-center text-gray-600 underline"
        >
          Είστε ήδη εγεγραμμένος; Συνδέσου!
        </Link>
      </Form>
    </div>
  );
}

export default Register;
