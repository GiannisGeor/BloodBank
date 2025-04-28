import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { getAntdInputValidation } from "../../utils/helpers";

const typeReadable = {
  donor: "Αιμοδότη",
  hospital: "Νοσοκομείου",
  organization: "Οργανισμού",
};
// Object.entries(typeReadable).map(["", value]);

function OrgHospitalForm({ type }) {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Όνομα Νοσοκομείου" : "Όνομα οργάνωσης"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="owner"
        label="Ιδιοκτήτης"
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Τηλέφωνο" rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item
        name="website"
        label="Ιστοσελίδα"
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Κωδικός"
        rules={getAntdInputValidation()}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="address"
        label="Διεύθυνση"
        className="col-span-2"
        rules={getAntdInputValidation()}
      >
        <TextArea />
      </Form.Item>
    </>
  );
}

export default OrgHospitalForm;
